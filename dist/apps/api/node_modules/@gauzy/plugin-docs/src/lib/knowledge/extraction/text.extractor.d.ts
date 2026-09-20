import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/**
 * Passthrough extractor for `text/plain` and `text/markdown`: UTF-8 normalize, strip
 * NULs, LF-only. Markdown headings in `.md` are kept and feed `headingPath` directly.
 */
export declare class TextExtractor implements IDocumentExtractor {
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
}
