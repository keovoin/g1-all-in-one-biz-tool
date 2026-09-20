import { DocumentOcrService } from './document-ocr.service';
import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/** Below this average of meaningful chars per page the PDF is considered scanned. */
export declare const PDF_SCANNED_CHARS_PER_PAGE = 50;
/**
 * The message a scanned PDF fails with when OCR cannot run.
 *
 * 🛑 **Unchanged on purpose.** It is what this extractor threw before OCR existed, and it is
 * what it still throws whenever OCR is off, no vision model resolves, or no PDF renderer is
 * installed — so a deployment that enables nothing sees byte-identical behavior, down to the
 * `statusMessage` on the row.
 */
export declare const PDF_OCR_UNAVAILABLE_MESSAGE = "This PDF appears to be scanned (no usable text layer). OCR is not available yet.";
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
export declare class PdfExtractor implements IDocumentExtractor {
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
    /**
     * The OCR branch: render the leading pages and transcribe them through the AI provider
     * seam. `null` — OCR disabled, no vision model, or no PDF renderer in this process —
     * reproduces the pre-OCR permanent error verbatim, so nothing regresses.
     */
    private extractViaOcr;
}
