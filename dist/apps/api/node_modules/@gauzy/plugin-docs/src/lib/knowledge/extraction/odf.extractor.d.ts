import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
/** Canonical MIME of an OpenDocument text document (`.odt`). */
export declare const ODT_MIME_TYPE = "application/vnd.oasis.opendocument.text";
/** Canonical MIME of an OpenDocument spreadsheet (`.ods`). */
export declare const ODS_MIME_TYPE = "application/vnd.oasis.opendocument.spreadsheet";
/**
 * Largest number of columns rendered per spreadsheet row.
 *
 * OpenDocument writers pad every row out to the sheet's full width with
 * `table:number-columns-repeated="16384"`, so expanding a repeat count literally is how a
 * three-cell row becomes sixteen thousand.
 */
export declare const ODS_MAX_COLUMNS_PER_ROW = 256;
/**
 * OpenDocument extractor for `.odt` and `.ods`.
 *
 * - **`.odt`** → the body in document order: `text:h` becomes a markdown heading at its own
 *   outline level, `text:p` a paragraph, `text:list` a bullet list (nesting preserved), and
 *   `table:table` a GitHub-style pipe table.
 * - **`.ods`** → one `## Sheet: <name>` section per sheet with a pipe table under it, sharing
 *   the XLSX extractor's {@link XLSX_MAX_ROWS_PER_SHEET} row cap so the two spreadsheet formats
 *   truncate identically.
 *
 * Both formats are ZIP packages holding a single `content.xml`, parsed with this plugin's own
 * package + XML readers — OpenDocument has no parser in the dependency tree, and these two MIME
 * types were already accepted by the upload endpoint and sniffer, so without an extractor every
 * such upload was a guaranteed `FAILED`.
 */
export declare class OdfExtractor implements IDocumentExtractor {
    /**
     * @inheritdoc
     */
    supports(mime: string): boolean;
    /**
     * @inheritdoc
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
    /**
     * Renders `office:text` in document order.
     *
     * Walked recursively rather than through `findAll`, because order is the whole point: a
     * flattened collection of headings, then paragraphs, then tables would put every section's
     * body under the wrong heading and make the extracted text actively misleading.
     *
     * @param content The parsed `content.xml`.
     * @returns The markdown plus a `pageCount` of 1 (a text document has no page structure the
     *          extractor can see — pagination is a rendering-time property of ODF).
     */
    private renderText;
    /**
     * Renders one level of body content into markdown lines.
     *
     * @param node The container whose children are rendered.
     * @param listDepth Current bullet-list nesting depth (0 = not in a list).
     * @returns The markdown lines for this level.
     */
    private renderBlocks;
    /**
     * Renders every non-empty sheet under its mandatory `## Sheet: <name>` locator heading — the
     * same machine-readable shape the XLSX extractor emits, so a citation into a spreadsheet
     * reads identically whichever format it came from.
     *
     * @param content The parsed `content.xml`.
     * @param warnings Collector for truncation notes.
     * @returns The markdown plus the non-empty sheet count.
     */
    private renderSpreadsheet;
    /**
     * Reads a `table:table` into a grid, expanding the repeat counts OpenDocument uses to
     * compress runs of identical cells and rows.
     *
     * 🛑 Both expansions are bounded, and that is not defensive decoration: a writer pads every
     * sheet to its full grid, so `table:number-rows-repeated="1048576"` on a trailing empty row
     * is the NORMAL case, and expanding it literally would allocate a million rows for a
     * three-row sheet. Trailing empty rows and cells are dropped instead of expanded, so the cap
     * only ever bites on real data.
     *
     * @param table The `table:table` element.
     * @param maxRows Row cap for the grid.
     * @returns The grid, whether the cap bit, and the pre-cap row count.
     */
    private tableRows;
    /** One spreadsheet row as plain cell strings, with trailing empty padding removed. */
    private rowCells;
    /** An OpenDocument repeat attribute as a sane positive integer (absent / bogus ⇒ 1). */
    private repeatCount;
    /**
     * The text of one element with the format's non-text glyphs resolved, collapsed to a single
     * line (a cell or paragraph is one line of markdown; embedded breaks would break a table).
     */
    private inlineText;
    /**
     * The `office:text` / `office:spreadsheet` element inside `office:body`.
     *
     * @param content The parsed `content.xml`.
     * @param localName `text` for `.odt`, `spreadsheet` for `.ods`.
     */
    private findBody;
}
