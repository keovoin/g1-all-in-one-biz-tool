import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/**
 * DOCX extractor: docx → semantic HTML (mammoth) → markdown (turndown + GFM, pipe tables
 * preserved). Legacy binary `.doc` is a permanent error with an actionable message.
 */
export declare class DocxExtractor implements IDocumentExtractor {
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
}
