/**
 * A dependency-free reader for the ZIP containers that OOXML (`.pptx`) and OpenDocument
 * (`.odt` / `.ods`) files are.
 *
 * Why hand-rolled: the plugin already ships a hand-rolled ZIP *writer* for the OOXML test
 * fixtures, for the same reason — a ZIP container is a short, fully specified format, and the
 * alternative is adding a general-purpose archive library to the backend's dependency tree to
 * read two office formats. The DOCX and XLSX paths get their ZIP handling for free inside
 * `mammoth` and `exceljs`; PPTX and ODF have no such parser in the tree, and this is what stands
 * in for it.
 *
 * Reads the CENTRAL DIRECTORY rather than streaming local headers: the central directory is the
 * authoritative index (a local header may carry zeroed sizes with a trailing data descriptor),
 * and it is what every real writer produces last.
 *
 * 🛑 Hardened, because the input is an untrusted upload: ZIP64 is refused rather than
 * mis-parsed, entry names are rejected if they escape the archive root, and both the per-entry
 * and the cumulative inflated size are capped so a zip bomb cannot exhaust the worker's heap.
 */
/** Largest inflated size accepted for ONE entry (a slide/content part is orders of magnitude smaller). */
export declare const OFFICE_PACKAGE_MAX_ENTRY_BYTES: number;
/** Largest total inflated size one package may yield across all the entries an extractor reads. */
export declare const OFFICE_PACKAGE_MAX_TOTAL_BYTES: number;
/** The read surface an extractor works against. */
export interface IOfficePackage {
    /** Every entry name in the archive, in central-directory order. */
    names(): string[];
    /** Whether an entry with this exact name exists. */
    has(name: string): boolean;
    /** The entry's decompressed bytes, or undefined when it does not exist. */
    read(name: string): Buffer | undefined;
    /** The entry decoded as UTF-8 with any BOM stripped, or undefined when it does not exist. */
    readText(name: string): string | undefined;
}
/**
 * Opens an OOXML / OpenDocument package for reading.
 *
 * @param buffer The uploaded file bytes.
 * @returns The package reader.
 * @throws DocsPermanentError when the bytes are not a readable ZIP container — a corrupt or
 *         password-protected office file is never going to succeed on a retry.
 */
export declare function openOfficePackage(buffer: Buffer): IOfficePackage;
