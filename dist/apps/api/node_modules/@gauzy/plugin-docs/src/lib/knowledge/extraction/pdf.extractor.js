"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfExtractor = exports.PDF_OCR_UNAVAILABLE_MESSAGE = exports.PDF_SCANNED_CHARS_PER_PAGE = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const pdfParse = require("pdf-parse");
const errors_1 = require("../errors");
const document_ocr_service_1 = require("./document-ocr.service");
const extractor_interface_1 = require("./extractor.interface");
/** Below this average of meaningful chars per page the PDF is considered scanned. */
exports.PDF_SCANNED_CHARS_PER_PAGE = 50;
/**
 * The message a scanned PDF fails with when OCR cannot run.
 *
 * 🛑 **Unchanged on purpose.** It is what this extractor threw before OCR existed, and it is
 * what it still throws whenever OCR is off, no vision model resolves, or no PDF renderer is
 * installed — so a deployment that enables nothing sees byte-identical behavior, down to the
 * `statusMessage` on the row.
 */
exports.PDF_OCR_UNAVAILABLE_MESSAGE = 'This PDF appears to be scanned (no usable text layer). OCR is not available yet.';
/**
 * PDF extractor (text layer): per-page extraction in reading order via `pdf-parse`,
 * with a `## Page N` locator heading per page when `pageCount > 1`. Pipe tables are not
 * reconstructed (raw text).
 *
 * Scanned PDFs (average < 50 meaningful chars/page) — and any run carrying `forceOcr` —
 * route to provider-vision OCR, which is env-gated (`GAUZY_DOCS_OCR_ENABLED`) and returns
 * `null` whenever it cannot run; that `null` reproduces the pre-OCR permanent error exactly.
 * Corrupt or password-protected files are a permanent error.
 */
let PdfExtractor = class PdfExtractor {
    // `@Optional()` so the extractor is still constructible on its own — the extraction specs
    // build the providers directly, and a `new PdfExtractor()` must keep the pre-OCR behavior.
    constructor(ocrService) {
        this.ocrService = ocrService;
    }
    /**
     * @inheritdoc
     */
    supports(mime) {
        return mime === 'application/pdf';
    }
    /**
     * @inheritdoc
     */
    async extract(buffer, ctx) {
        const pages = [];
        // `forceOcr` (the reprocess dialog's "run OCR" option) bypasses the text-layer fast
        // path entirely — a PDF whose text layer is present but garbage is exactly the case
        // a human reaches for it.
        if (ctx.forceOcr) {
            return this.extractViaOcr(buffer, ctx);
        }
        let pageCount = 0;
        try {
            // `pdf-parse` drives pdf.js through an in-process loopback "worker" whose
            // structured-clone shim re-wraps the input as `new input.constructor(input)`.
            // For a Node `Buffer` that is the legacy `new Buffer(…)` path, which for inputs
            // under Node's 4 KiB pool threshold returns a POOLED buffer — one whose
            // `.buffer` is the shared 8 KiB allocation pool. pdf.js resolves every xref
            // offset against `bytes.buffer`, so it reads from the pool base instead of the
            // file and the parse dies with "bad XRef entry". Whether it happens depends on
            // the pool's fill level, so small PDFs fail non-deterministically. A standalone
            // `Uint8Array` clones to `byteOffset: 0` and parses reliably at any size.
            const bytes = new Uint8Array(buffer);
            // `pagerender` collects per-page text so `## Page N` locators can be emitted.
            const result = await pdfParse(bytes, {
                pagerender: async (pageData) => {
                    const textContent = await pageData.getTextContent({
                        normalizeWhitespace: true,
                        disableCombineTextItems: false
                    });
                    let lastY;
                    let text = '';
                    for (const item of textContent.items ?? []) {
                        const y = item.transform?.[5];
                        if (lastY !== undefined && y !== lastY) {
                            text += '\n';
                        }
                        text += item.str ?? '';
                        lastY = y;
                    }
                    pages.push(text);
                    return text;
                }
            });
            pageCount = Number(result?.numpages) || pages.length;
        }
        catch (error) {
            if ((0, errors_1.isTransientError)(error)) {
                throw new errors_1.DocsTransientError('Temporary failure while reading the PDF.', error);
            }
            throw new errors_1.DocsPermanentError('The PDF could not be read — it may be corrupt or password-protected.', error);
        }
        // Scanned heuristic: average < 50 meaningful chars/page ⇒ OCR path (P1, M5).
        const meaningfulChars = pages.reduce((sum, page) => sum + page.replace(/\s+/g, '').length, 0);
        const average = pageCount > 0 ? meaningfulChars / pageCount : 0;
        if (average < exports.PDF_SCANNED_CHARS_PER_PAGE) {
            return this.extractViaOcr(buffer, ctx);
        }
        const rendered = pageCount > 1
            ? pages.map((page, index) => `## Page ${index + 1}\n\n${page.trim()}`).join('\n\n')
            : (pages[0] ?? '').trim();
        const normalized = (0, extractor_interface_1.normalizeMarkdown)(rendered);
        const { markdown, truncated } = (0, extractor_interface_1.capMarkdown)(normalized, ctx.maxChars);
        return {
            markdown,
            metadata: { pageCount, truncated, wordCount: (0, extractor_interface_1.countWords)(markdown) }
        };
    }
    /**
     * The OCR branch: render the leading pages and transcribe them through the AI provider
     * seam. `null` — OCR disabled, no vision model, or no PDF renderer in this process —
     * reproduces the pre-OCR permanent error verbatim, so nothing regresses.
     */
    async extractViaOcr(buffer, ctx) {
        const ocr = this.ocrService ? await this.ocrService.transcribePdf(buffer, ctx) : null;
        if (!ocr) {
            throw new errors_1.DocsPermanentError(exports.PDF_OCR_UNAVAILABLE_MESSAGE);
        }
        const normalized = (0, extractor_interface_1.normalizeMarkdown)(ocr.markdown);
        const { markdown, truncated } = (0, extractor_interface_1.capMarkdown)(normalized, ctx.maxChars);
        return {
            markdown,
            metadata: {
                pageCount: ocr.provenance.pageCount,
                truncated: truncated || ocr.provenance.capped,
                warnings: ocr.warnings.length ? ocr.warnings : undefined,
                wordCount: (0, extractor_interface_1.countWords)(markdown),
                ocr: ocr.provenance
            }
        };
    }
};
exports.PdfExtractor = PdfExtractor;
exports.PdfExtractor = PdfExtractor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__metadata("design:paramtypes", [document_ocr_service_1.DocumentOcrService])
], PdfExtractor);
//# sourceMappingURL=pdf.extractor.js.map