import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/** Row cap of the CSV → markdown-table conversion (spec: 1000 rows + truncation note). */
export declare const CSV_MAX_ROWS = 1000;
/**
 * Detects the most plausible delimiter by counting unquoted occurrences on the first
 * non-empty lines; ties break by candidate order.
 *
 * @param text The CSV text (first lines are enough).
 * @returns The detected delimiter character.
 */
export declare function detectDelimiter(text: string): string;
/**
 * Lenient RFC-4180-style CSV parse: quoted fields, escaped quotes (`""`), delimiter
 * auto-detected by the caller. Pure and deterministic — no dependencies.
 *
 * @param text The CSV text.
 * @param delimiter The field delimiter.
 * @param maxRows Hard row cap (parsing stops beyond it).
 * @returns The parsed rows plus a flag for capped input.
 */
export declare function parseCsv(text: string, delimiter: string, maxRows: number): {
    rows: string[][];
    capped: boolean;
};
/**
 * Renders parsed CSV rows as one GitHub-style pipe table under the mandatory
 * `## Sheet: <filename-stem>` locator heading.
 */
export declare function csvRowsToMarkdown(rows: string[][], sheetName: string, totalNote?: string): string;
/**
 * CSV extractor: delimiter auto-detect, lenient parse → single markdown pipe table with
 * a `## Sheet: <filename-stem>` heading, capped at 1000 rows with a truncation note.
 */
export declare class CsvExtractor implements IDocumentExtractor {
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
}
