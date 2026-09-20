import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/** Row cap per sheet of the XLSX → markdown conversion (spec: 500 rows/sheet). */
export declare const XLSX_MAX_ROWS_PER_SHEET = 500;
/**
 * XLSX extractor: sheet-aware — one GitHub-style pipe table per sheet under the
 * mandatory `## Sheet: <name>` locator heading (always emitted, even for one sheet —
 * it is the sheet locator). Caps 500 rows/sheet with a visible truncation note.
 * `pageCount` = non-empty sheets.
 */
export declare class XlsxExtractor implements IDocumentExtractor {
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
    /**
     * Renders an ExcelJS cell value (rich text, formula results, dates, hyperlinks) as
     * plain text.
     */
    private cellToString;
}
