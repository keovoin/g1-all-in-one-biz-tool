import * as TurndownService from 'turndown';
import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/**
 * Builds a GFM-enabled Turndown converter (shared by the HTML and DOCX extractors).
 */
export declare function createTurndown(): TurndownService;
/**
 * HTML extractor: sanitize → markdown. Scripts/styles/frames/event handlers are stripped
 * BEFORE conversion; only text-level structure survives. No raw HTML is ever emitted.
 */
export declare class HtmlExtractor implements IDocumentExtractor {
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
}
