import { DocsAiService } from '../ai/docs-ai.service';
import { IDocumentExtractionContext, IDocumentOcrProvenance } from './extractor.interface';
import { PdfRasterizerService } from './pdf-rasterizer.service';
/** Longest side an image is downscaled to before it is sent to the model (07 §4 row 8). */
export declare const OCR_IMAGE_MAX_PX = 2000;
/** What a completed OCR run produced. */
export interface IDocumentOcrResult {
    /** Normalized-ish markdown (the caller still runs it through `normalizeMarkdown`). */
    markdown: string;
    /** Provenance block persisted under `metadata.extraction.ocr`. */
    provenance: IDocumentOcrProvenance;
    /** Per-page failures and cap notices, surfaced on `metadata.extraction.warnings`. */
    warnings: string[];
}
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
export declare class DocumentOcrService {
    private readonly docsAiService;
    private readonly rasterizer;
    private readonly logger;
    constructor(docsAiService: DocsAiService, rasterizer: PdfRasterizerService);
    /**
     * True when the OCR switch is on. Says nothing about provider availability — that is
     * only knowable by resolving a model.
     */
    isEnabled(): boolean;
    /**
     * Transcribes a single image (png/jpeg/webp/gif) — `pageCount` is always 1.
     *
     * @param buffer The image bytes.
     * @param ctx The extraction context (tenant snapshot, filename).
     * @returns The transcription, or `null` when OCR is unavailable.
     * @throws DocsTransientError when the provider call fails (a retry may succeed).
     */
    transcribeImage(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentOcrResult | null>;
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
    transcribePdf(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentOcrResult | null>;
    /**
     * Resolves the vision model, or `null` when OCR cannot run at all.
     */
    private resolveModel;
    /**
     * One page → one provider call. Returns `null` on failure (the caller decides whether a
     * single failed page is fatal); the usage event is emitted either way.
     */
    private transcribePage;
    /**
     * Downscales an image to {@link OCR_IMAGE_MAX_PX} on its longest side and normalizes it to
     * PNG — smaller upload, fewer image tokens, one media type for every provider. A `sharp`
     * failure degrades to the original bytes: a provider that can read the source directly
     * should still get its chance.
     */
    private downscale;
    /** Builds the provenance block persisted under `metadata.extraction.ocr`. */
    private provenanceOf;
    /** Cost accounting for one OCR call — the same event embedding/classification emit (§7.4). */
    private emitUsage;
}
