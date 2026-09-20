"use strict";
var DocumentOcrService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentOcrService = exports.OCR_IMAGE_MAX_PX = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const sharp = require("sharp");
const docs_config_1 = require("../../docs.config");
const docs_ai_service_1 = require("../ai/docs-ai.service");
const errors_1 = require("../errors");
const ocr_prompt_1 = require("./ocr.prompt");
const pdf_rasterizer_service_1 = require("./pdf-rasterizer.service");
/** Longest side an image is downscaled to before it is sent to the model (07 §4 row 8). */
exports.OCR_IMAGE_MAX_PX = 2000;
/**
 * Provider-vision OCR for scanned PDFs and image uploads (07 §4, rows 2 and 8).
 *
 * **It adds no third-party OCR engine.** Transcription is one `generateText` call per page
 * against the very model classification uses, resolved through {@link DocsAiService} with the
 * same credential order (tenant BYOK → environment → platform). Rasterization of PDF pages is
 * delegated to {@link PdfRasterizerService}; images only need `sharp`, which the plugin
 * already ships.
 *
 * 🛑 **Every "cannot" answer is `null`, not an exception**, and that is the compatibility
 * contract: OCR off, AI off, no provider credentials, no vision model, no PDF renderer — all
 * return `null`, and the calling extractor then throws the exact permanent error it threw
 * before OCR existed. A deployment that changes nothing sees no behavior change whatsoever.
 *
 * Cost safety: the page cap (`GAUZY_DOCS_OCR_MAX_PAGES`, default 20) is applied *before* any
 * call is made, and every call — successful or not — emits the `docs-ocr` usage event the
 * classification and embedding paths already emit.
 */
let DocumentOcrService = DocumentOcrService_1 = class DocumentOcrService {
    constructor(docsAiService, rasterizer) {
        this.docsAiService = docsAiService;
        this.rasterizer = rasterizer;
        this.logger = new common_1.Logger(DocumentOcrService_1.name);
    }
    /**
     * True when the OCR switch is on. Says nothing about provider availability — that is
     * only knowable by resolving a model.
     */
    isEnabled() {
        return (0, docs_config_1.getDocsConfig)().ocrEnabled;
    }
    /**
     * Transcribes a single image (png/jpeg/webp/gif) — `pageCount` is always 1.
     *
     * @param buffer The image bytes.
     * @param ctx The extraction context (tenant snapshot, filename).
     * @returns The transcription, or `null` when OCR is unavailable.
     * @throws DocsTransientError when the provider call fails (a retry may succeed).
     */
    async transcribeImage(buffer, ctx) {
        const model = await this.resolveModel(ctx.tenantId);
        if (!model) {
            return null;
        }
        const png = await this.downscale(buffer);
        const text = await this.transcribePage(model, png, ctx, 1);
        if (text === null) {
            // A single-page source has nothing left to salvage — retryable, not terminal.
            throw new errors_1.DocsTransientError('The image could not be transcribed by the vision provider.');
        }
        return {
            markdown: text,
            provenance: this.provenanceOf(model, 1, 1, false),
            warnings: []
        };
    }
    /**
     * Transcribes a scanned PDF page by page, capped at `GAUZY_DOCS_OCR_MAX_PAGES`.
     *
     * Per-page failures skip that page (with a visible note) rather than losing the document;
     * an all-pages-failed run is classified transient, per the spec.
     *
     * @param buffer The PDF bytes.
     * @param ctx The extraction context (tenant snapshot, filename).
     * @returns The transcription, or `null` when OCR — or the PDF renderer — is unavailable.
     */
    async transcribePdf(buffer, ctx) {
        const model = await this.resolveModel(ctx.tenantId);
        if (!model) {
            return null;
        }
        const maxPages = (0, docs_config_1.getDocsConfig)().ocrMaxPages;
        // The cap is applied at RENDER time, so capped pages cost neither pixels nor tokens.
        const rendered = await this.rasterizer.renderPages(buffer, maxPages);
        if (!rendered || rendered.pages.length === 0) {
            return null;
        }
        const warnings = [];
        const sections = [];
        let transcribed = 0;
        for (let index = 0; index < rendered.pages.length; index++) {
            const pageNumber = index + 1;
            const text = await this.transcribePage(model, rendered.pages[index], ctx, pageNumber);
            if (text === null) {
                warnings.push((0, ocr_prompt_1.buildOcrPageFailureNote)(pageNumber));
                sections.push(`## Page ${pageNumber}\n\n${(0, ocr_prompt_1.buildOcrPageFailureNote)(pageNumber)}`);
                continue;
            }
            transcribed++;
            sections.push(`## Page ${pageNumber}\n\n${text}`);
        }
        if (transcribed === 0) {
            throw new errors_1.DocsTransientError('No page of this PDF could be transcribed by the vision provider.');
        }
        const capped = rendered.pageCount > rendered.pages.length;
        if (capped) {
            const note = (0, ocr_prompt_1.buildOcrCapNote)(rendered.pages.length, rendered.pageCount);
            warnings.push(note);
            sections.push(note);
        }
        return {
            markdown: sections.join('\n\n'),
            provenance: this.provenanceOf(model, rendered.pageCount, transcribed, capped),
            warnings
        };
    }
    /**
     * Resolves the vision model, or `null` when OCR cannot run at all.
     */
    async resolveModel(tenantId) {
        if (!this.isEnabled()) {
            return null;
        }
        const resolved = await this.docsAiService.resolveVisionModel(tenantId);
        if (!resolved) {
            this.logger.debug('OCR is enabled but no vision model resolves — falling back to the pre-OCR behavior.');
        }
        return resolved;
    }
    /**
     * One page → one provider call. Returns `null` on failure (the caller decides whether a
     * single failed page is fatal); the usage event is emitted either way.
     */
    async transcribePage(resolved, png, ctx, pageNumber) {
        const sdk = await this.docsAiService.loadAiSdk();
        if (!sdk) {
            return null;
        }
        const startedAt = Date.now();
        // Image tokens are not chars/4 — the estimate covers the text turns only and is
        // flagged `estimated` so the cost rollup never mistakes it for a provider number.
        let usage = {
            inputTokens: Math.ceil((ocr_prompt_1.OCR_SYSTEM_PROMPT.length + ocr_prompt_1.OCR_USER_PROMPT.length) / 4),
            outputTokens: 0,
            estimated: true
        };
        try {
            const messages = [
                { role: 'system', content: ocr_prompt_1.OCR_SYSTEM_PROMPT },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: ocr_prompt_1.OCR_USER_PROMPT },
                        { type: 'image', image: png, mediaType: 'image/png' }
                    ]
                }
            ];
            const result = await sdk.generateText({
                model: resolved.model,
                messages,
                temperature: 0,
                maxOutputTokens: ocr_prompt_1.OCR_MAX_OUTPUT_TOKENS
            });
            const text = (result.text ?? '').trim();
            const reported = result.usage;
            if (Number.isFinite(reported?.inputTokens) && Number.isFinite(reported?.outputTokens)) {
                usage = { inputTokens: reported.inputTokens, outputTokens: reported.outputTokens, estimated: false };
            }
            else {
                usage.outputTokens = Math.ceil(text.length / 4);
            }
            this.emitUsage(ctx, resolved, usage, startedAt, true);
            return text;
        }
        catch (error) {
            this.emitUsage(ctx, resolved, usage, startedAt, false);
            this.logger.warn(`OCR failed for page ${pageNumber} of "${ctx.filename}": ${error.message}`);
            return null;
        }
    }
    /**
     * Downscales an image to {@link OCR_IMAGE_MAX_PX} on its longest side and normalizes it to
     * PNG — smaller upload, fewer image tokens, one media type for every provider. A `sharp`
     * failure degrades to the original bytes: a provider that can read the source directly
     * should still get its chance.
     */
    async downscale(buffer) {
        try {
            return await sharp(buffer, { failOn: 'none' })
                .resize({ width: exports.OCR_IMAGE_MAX_PX, height: exports.OCR_IMAGE_MAX_PX, fit: 'inside', withoutEnlargement: true })
                .png()
                .toBuffer();
        }
        catch (error) {
            this.logger.debug(`Image downscale before OCR failed, sending the original bytes: ${error.message}`);
            return buffer;
        }
    }
    /** Builds the provenance block persisted under `metadata.extraction.ocr`. */
    provenanceOf(resolved, pageCount, pagesTranscribed, capped) {
        return {
            pageCount,
            pagesTranscribed,
            capped,
            providerId: resolved.providerId,
            model: resolved.modelId,
            transcribedAt: new Date().toISOString()
        };
    }
    /** Cost accounting for one OCR call — the same event embedding/classification emit (§7.4). */
    emitUsage(ctx, resolved, usage, startedAt, success) {
        this.docsAiService.emitUsage({
            tenantId: ctx.tenantId,
            organizationId: ctx.organizationId,
            feature: 'docs-ocr',
            providerId: resolved.providerId,
            model: resolved.modelId,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            estimated: usage.estimated,
            durationMs: Date.now() - startedAt,
            success
        });
    }
};
exports.DocumentOcrService = DocumentOcrService;
exports.DocumentOcrService = DocumentOcrService = DocumentOcrService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [docs_ai_service_1.DocsAiService, pdf_rasterizer_service_1.PdfRasterizerService])
], DocumentOcrService);
//# sourceMappingURL=document-ocr.service.js.map