/**
 * Thumbnail generation constants (07 §4.4).
 *
 * Deliberately small: a thumbnail is a grid tile, not a preview. Anything larger costs
 * storage and bandwidth on every list render for no visible gain.
 */
/** Longest side of a generated thumbnail, in pixels. */
export declare const DOCS_THUMBNAIL_MAX_PX = 320;
/** WebP quality of a generated thumbnail (visually lossless at this size). */
export declare const DOCS_THUMBNAIL_QUALITY = 72;
/** Suffix appended to the source storage key — `<key-without-ext>-thumb.webp`. */
export declare const DOCS_THUMBNAIL_SUFFIX = "-thumb.webp";
/** Raster image types that produce a thumbnail directly through `sharp`. */
export declare const THUMBNAILABLE_IMAGE_MIME_TYPES: string[];
/** The only non-image type with a thumbnail: page 1 of a PDF, rasterized first. */
export declare const THUMBNAILABLE_PDF_MIME_TYPE = "application/pdf";
/**
 * Whether a stored MIME can produce a thumbnail at all.
 *
 * Pure and exported because it is asked in **two** places that must agree: the pipeline
 * (which skips enqueuing the job entirely for a docx/csv/txt — no queue traffic for work
 * that would immediately no-op) and the thumbnail service itself (the authoritative skip,
 * since a job can also arrive from a reprocess or a recovery sweep).
 *
 * @param mimeType The sniffed canonical MIME stored on the document.
 */
export declare function isThumbnailableMime(mimeType?: string | null): boolean;
/**
 * Derives the thumbnail storage key from the source key: same directory, same basename,
 * `-thumb.webp` instead of the original extension. Keeping it adjacent to the source means
 * the existing key-shape guard, retention and cleanup all cover it for free.
 *
 * @param storageKey The document's stored file key.
 */
export declare function thumbnailKeyFor(storageKey: string): string;
