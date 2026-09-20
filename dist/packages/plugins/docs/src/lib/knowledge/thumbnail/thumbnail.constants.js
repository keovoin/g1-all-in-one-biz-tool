"use strict";
/**
 * Thumbnail generation constants (07 §4.4).
 *
 * Deliberately small: a thumbnail is a grid tile, not a preview. Anything larger costs
 * storage and bandwidth on every list render for no visible gain.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.THUMBNAILABLE_PDF_MIME_TYPE = exports.THUMBNAILABLE_IMAGE_MIME_TYPES = exports.DOCS_THUMBNAIL_SUFFIX = exports.DOCS_THUMBNAIL_QUALITY = exports.DOCS_THUMBNAIL_MAX_PX = void 0;
exports.isThumbnailableMime = isThumbnailableMime;
exports.thumbnailKeyFor = thumbnailKeyFor;
/** Longest side of a generated thumbnail, in pixels. */
exports.DOCS_THUMBNAIL_MAX_PX = 320;
/** WebP quality of a generated thumbnail (visually lossless at this size). */
exports.DOCS_THUMBNAIL_QUALITY = 72;
/** Suffix appended to the source storage key — `<key-without-ext>-thumb.webp`. */
exports.DOCS_THUMBNAIL_SUFFIX = '-thumb.webp';
/** Raster image types that produce a thumbnail directly through `sharp`. */
exports.THUMBNAILABLE_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
/** The only non-image type with a thumbnail: page 1 of a PDF, rasterized first. */
exports.THUMBNAILABLE_PDF_MIME_TYPE = 'application/pdf';
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
function isThumbnailableMime(mimeType) {
    if (!mimeType) {
        return false;
    }
    return mimeType === exports.THUMBNAILABLE_PDF_MIME_TYPE || exports.THUMBNAILABLE_IMAGE_MIME_TYPES.includes(mimeType);
}
/**
 * Derives the thumbnail storage key from the source key: same directory, same basename,
 * `-thumb.webp` instead of the original extension. Keeping it adjacent to the source means
 * the existing key-shape guard, retention and cleanup all cover it for free.
 *
 * @param storageKey The document's stored file key.
 */
function thumbnailKeyFor(storageKey) {
    return `${storageKey.replace(/\.[A-Za-z0-9]+$/, '')}${exports.DOCS_THUMBNAIL_SUFFIX}`;
}
//# sourceMappingURL=thumbnail.constants.js.map