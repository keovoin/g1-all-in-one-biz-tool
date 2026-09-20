import { DocumentOcrService } from './document-ocr.service';
import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/** The raster image types the upload sniffer accepts (`services/file-sniffer.ts`). */
export declare const IMAGE_OCR_MIME_TYPES: string[];
/**
 * The message an image upload fails with when OCR cannot run.
 *
 * 🛑 Unlike classification, which degrades silently, an image with no OCR has **no content at
 * all** — there is nothing to index and nothing to search, so the honest outcome is a
 * permanent failure the reviewer can see and act on (07 §4 row 8).
 */
export declare const IMAGE_OCR_UNAVAILABLE_MESSAGE = "This image contains no machine-readable text. Text recognition (OCR) is not enabled for this deployment.";
/**
 * Image extractor: `image/png|jpeg|webp|gif` → provider-vision OCR (07 §4 row 8).
 *
 * `pageCount` is always 1. The OCR service is injected `@Optional()` so the extractor stays
 * constructible on its own (as the sibling extractors are, and as the extraction specs build
 * them) — without it, and whenever OCR is switched off or no vision model resolves, the
 * result is the same permanent error, which `DocumentProcessingService.markExtractionFailed`
 * turns into `FAILED` + `PENDING / extraction-failed`.
 */
export declare class ImageExtractor implements IDocumentExtractor {
    private readonly ocrService?;
    constructor(ocrService?: DocumentOcrService);
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
}
