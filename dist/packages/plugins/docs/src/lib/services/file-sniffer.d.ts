/**
 * Magic-byte content sniffing for Documents uploads — pure functions, no I/O.
 *
 * The client-declared MIME is advisory only; the stored `document.mimeType` is always the
 * **sniffed canonical** value produced here. Sniff window: first 4096 bytes (ZIP internal
 * entry checks scan the whole buffer). Allowlist and signatures follow the security spec
 * (`08-permissions-security.md` §5): pdf, docx/xlsx/pptx/odt/ods (ZIP + internal entry),
 * csv/txt/md (strict UTF-8 text heuristic), html (sanitized downstream), png/jpg/webp/gif.
 * Markup masquerading as an image is rejected (image-asset hardening precedent) and
 * **SVG is not accepted in any form** — neither are `.xml`/`.xhtml`.
 */
/** Number of leading bytes inspected by the signature checks. */
export declare const SNIFF_WINDOW_BYTES = 4096;
/** One row of the sniffing allowlist. */
export interface ISniffedType {
    /** Canonical MIME stored on `document.mimeType`. */
    mimeType: string;
    /** Canonical extension used in storage keys (no dot). */
    extension: string;
}
/** Result of a sniff run. */
export interface ISniffResult {
    ok: boolean;
    /** Set when `ok` — the canonical detection. */
    type?: ISniffedType;
    /** Set when `!ok` — a stable `DOCS_*`-style error code. */
    code?: string;
    /** Set when `!ok` — a user-safe message. */
    message?: string;
}
/**
 * Extracts the lowercase extension (without dot) from a filename. Empty string when absent.
 */
export declare function extractExtension(filename: string): string;
/**
 * Detects markup content (SVG / XML / HTML / XHTML) pretending to be something else —
 * the image-asset hardening check: a UTF-16/32 BOM, or first non-whitespace byte `<`.
 *
 * Raster images never start with `<` nor a UTF-16/32 BOM, so this has no false positives
 * on legitimate images.
 *
 * @param buffer The raw file bytes.
 * @returns True when the content appears to be markup.
 */
export declare function isMarkupContent(buffer: Buffer): boolean;
/**
 * Strict UTF-8 text heuristic for csv/txt/md/html acceptance: no NUL bytes, no UTF-16/32
 * BOM, and valid UTF-8 within the sniff window (with a ≤3-byte trim tolerance for a
 * multi-byte sequence cut at the window edge).
 *
 * @param buffer The raw file bytes (only the sniff window is inspected).
 * @returns True when the content is plausibly UTF-8 text.
 */
export declare function isProbablyUtf8Text(buffer: Buffer): boolean;
export declare function zipHasEntry(buffer: Buffer, predicate: (name: string) => boolean): boolean;
/**
 * Sniffs the canonical type from the raw bytes alone (no filename input). Returns null
 * when no binary signature matches — text types are resolved by `sniffFile` using the
 * filename extension to pick among csv/txt/md/html.
 */
export declare function sniffBinarySignature(buffer: Buffer): ISniffedType | null;
/**
 * Full sniff gauntlet for one uploaded file: signature detection, text heuristic,
 * markup-in-image rejection, the SVG/XML ban, and extension ↔ signature ↔ declared-MIME
 * consistency (declared MIME may be empty or `application/octet-stream`).
 *
 * @param buffer The stored file bytes.
 * @param filename The client-supplied original filename (extension source).
 * @param declaredMime The client-declared MIME (advisory only).
 * @returns Accept/reject with the canonical type or a stable error code.
 */
export declare function sniffFile(buffer: Buffer, filename: string, declaredMime?: string): ISniffResult;
/**
 * Returns the canonical storage-key extension for a canonical MIME (no dot),
 * stripped to `[a-z0-9]`.
 */
export declare function canonicalExtension(mimeType: string): string;
