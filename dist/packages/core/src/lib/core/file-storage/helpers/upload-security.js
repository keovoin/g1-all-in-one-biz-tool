"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENDERABLE_KEY_EXTENSIONS = exports.MARKUP_SCAN_MAX_BYTES = exports.SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS = exports.archiveUploadFileFilter = exports.ALLOWED_ARCHIVE_EXTENSIONS = exports.ALLOWED_ARCHIVE_MIME_TYPES = exports.audioUploadFileFilter = exports.videoUploadFileFilter = exports.imageUploadFileFilter = exports.ALLOWED_AUDIO_EXTENSIONS = exports.ALLOWED_AUDIO_MIME_TYPES = exports.ALLOWED_VIDEO_EXTENSIONS = exports.ALLOWED_VIDEO_MIME_TYPES = exports.ALLOWED_IMAGE_EXTENSIONS = exports.ALLOWED_IMAGE_MIME_TYPES = exports.BLOCKED_UPLOAD_EXTENSIONS = void 0;
exports.createUploadFileFilter = createUploadFileFilter;
exports.documentUploadFileFilter = documentUploadFileFilter;
exports.isMarkupContent = isMarkupContent;
exports.shouldScanForMarkup = shouldScanForMarkup;
exports.assertNotMarkupContent = assertNotMarkupContent;
exports.toSafeStorageExtension = toSafeStorageExtension;
const path = require("path");
const common_1 = require("@nestjs/common");
/**
 * Extensions that are never safe to store, because uploads are served unauthenticated from
 * `/public/<key>` with a `Content-Type` derived from the on-disk extension. A file stored as
 * `.svg`/`.html` is therefore served as active content and executes script in the application's
 * origin — stored XSS (GHSA-p334-cm7f-php5).
 */
exports.BLOCKED_UPLOAD_EXTENSIONS = ['.svg', '.svgz', '.html', '.htm', '.xml', '.xhtml'];
/** Raster image MIME types accepted by the image upload endpoints. */
exports.ALLOWED_IMAGE_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/bmp'
];
/** Extensions accepted by the image upload endpoints. */
exports.ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'];
/** Video MIME types accepted by the video upload endpoints. */
exports.ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm'];
/** Extensions accepted by the video upload endpoints. */
exports.ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm'];
/** Audio MIME types accepted by the audio upload endpoints. */
exports.ALLOWED_AUDIO_MIME_TYPES = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/webm',
    'audio/ogg'
];
/** Extensions accepted by the audio upload endpoints. */
exports.ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.webm', '.weba', '.ogg', '.oga', '.m4a'];
/**
 * Builds a multer `fileFilter` that accepts a file only when BOTH its MIME type and its extension
 * are on the given allowlists.
 *
 * The extension is allowlisted rather than denylisted on purpose. `/public` derives `Content-Type`
 * from the stored extension, so anything not explicitly known-inert is a potential active-content
 * type — a denylist has to enumerate every dangerous extension (`.svg`, `.xhtml`, `.mhtml`, `.xsl`,
 * `.shtml`, no extension at all, …) and is wrong the moment one is missed. {@link
 * BLOCKED_UPLOAD_EXTENSIONS} is still applied as a backstop so a risky extension added to an
 * allowlist by mistake is still refused.
 *
 * Neither check inspects the bytes, and both the MIME type and the filename come from the client,
 * so callers that persist the file must also run {@link assertNotMarkupContent} on the stored
 * content.
 *
 * @param allowedMimeTypes - The MIME types to accept.
 * @param allowedExtensions - The lowercase extensions to accept, each including the leading dot.
 * @returns A multer-compatible `fileFilter`.
 */
function createUploadFileFilter(allowedMimeTypes, allowedExtensions) {
    // Subtract the blocklist once, here, rather than re-testing it on every request: with an
    // allowlist the per-request blocklist check is dead code, but applying it at construction still
    // guarantees a dangerous extension cannot enter service by being added to an allowlist later.
    const acceptedExtensions = allowedExtensions.filter((extension) => !exports.BLOCKED_UPLOAD_EXTENSIONS.includes(extension));
    return (_req, file, callback) => {
        const extension = path.extname(file?.originalname || '').toLowerCase();
        if (allowedMimeTypes.includes(file?.mimetype) && acceptedExtensions.includes(extension)) {
            callback(null, true);
        }
        else {
            callback(new common_1.BadRequestException(`Unsupported file type: ${file?.mimetype || extension || 'unknown'}`), false);
        }
    };
}
/** Multer `fileFilter` accepting only raster images. */
exports.imageUploadFileFilter = createUploadFileFilter(exports.ALLOWED_IMAGE_MIME_TYPES, exports.ALLOWED_IMAGE_EXTENSIONS);
/** Multer `fileFilter` accepting only video files. */
exports.videoUploadFileFilter = createUploadFileFilter(exports.ALLOWED_VIDEO_MIME_TYPES, exports.ALLOWED_VIDEO_EXTENSIONS);
/** Multer `fileFilter` accepting only audio files. */
exports.audioUploadFileFilter = createUploadFileFilter(exports.ALLOWED_AUDIO_MIME_TYPES, exports.ALLOWED_AUDIO_EXTENSIONS);
/** MIME types browsers/clients send for a ZIP archive. */
exports.ALLOWED_ARCHIVE_MIME_TYPES = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'multipart/x-zip',
    'application/octet-stream'
];
/** Extensions accepted by the archive (import) endpoints. */
exports.ALLOWED_ARCHIVE_EXTENSIONS = ['.zip'];
/** Multer `fileFilter` accepting only ZIP archives (the data-import format). */
exports.archiveUploadFileFilter = createUploadFileFilter(exports.ALLOWED_ARCHIVE_MIME_TYPES, exports.ALLOWED_ARCHIVE_EXTENSIONS);
/**
 * Extensions that are script-capable when served by extension yet have no legitimate use on the
 * open-ended DOCUMENT upload endpoints (chat attachments, knowledge ingestion): those endpoints must
 * accept `.html`/`.xml` (they are ingested), so an allowlist is impossible there and this is the
 * backstop for the rest. `/public` additionally serves every asset with `nosniff` + a `sandbox` CSP.
 */
exports.SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS = [
    '.svg',
    '.svgz',
    '.xhtml',
    '.xht',
    '.mhtml',
    '.mht',
    '.xsl',
    '.xslt',
    '.shtml',
    '.shtm',
    '.hta',
    '.js',
    '.mjs',
    '.vbs',
    '.wsf'
];
/**
 * Multer `fileFilter` for open-ended document uploads: refuses {@link SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS}
 * and accepts everything else. Callers still store the bytes behind `/public`'s `sandbox` CSP.
 */
function documentUploadFileFilter(_req, file, callback) {
    const name = String(file?.originalname ?? '').toLowerCase();
    const dot = name.lastIndexOf('.');
    const extension = dot >= 0 ? name.slice(dot) : '';
    if (exports.SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS.includes(extension)) {
        return callback(new common_1.BadRequestException(`Files of type "${extension}" are not allowed`), false);
    }
    return callback(null, true);
}
/**
 * Detects whether the given file content is markup (SVG / XML / HTML / XHTML).
 *
 * In every encoding the test is the same: the first meaningful character must be `<`.
 *
 * - **UTF-16 / UTF-32.** A byte-order mark is consumed first, then the NUL padding those encodings
 *   interleave, and the first real character must still be `<`. The BOM alone is deliberately NOT
 *   treated as proof of markup: `FF FE` is also a valid MPEG-1 Layer I audio frame header, so
 *   rejecting on the BOM by itself would refuse legitimate audio uploads. (A frame that really did
 *   continue `FF FE 3C ..` would carry a reserved sample-rate and be invalid anyway.)
 *
 * BOM-less UTF-16 is deliberately not detected. Doing so would mean treating a leading run of NULs
 * as padding, and an MP4 whose first box is 60 bytes begins with exactly `00 00 00 3C` — the check
 * would reject valid video. It is also barely a vector: XML without a BOM or an encoding
 * declaration is not parsed as UTF-16 by browsers, and the extension allowlist in
 * {@link createUploadFileFilter} already refuses `.svg`/`.xhtml` outright.
 * - **UTF-8**, with or without a BOM: the first non-whitespace byte is `<`.
 *
 * @param content - The raw file bytes (or string) to inspect.
 * @returns `true` if the content appears to be markup.
 */
function isMarkupContent(content) {
    if (!content) {
        return false;
    }
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(String(content));
    if (buffer.length === 0) {
        return false;
    }
    const startsWith = (...bytes) => buffer.length >= bytes.length && bytes.every((value, index) => buffer[index] === value);
    const isWhitespace = (byte) => byte === 0x20 || byte === 0x09 || byte === 0x0a || byte === 0x0d;
    const LESS_THAN = 0x3c;
    // Wide encodings: consume the BOM, then the NUL padding, then require `<`.
    let wideBomLength = 0;
    if (startsWith(0xff, 0xfe, 0x00, 0x00) || startsWith(0x00, 0x00, 0xfe, 0xff)) {
        wideBomLength = 4; // UTF-32 LE / BE
    }
    else if (startsWith(0xff, 0xfe) || startsWith(0xfe, 0xff)) {
        wideBomLength = 2; // UTF-16 LE / BE
    }
    if (wideBomLength > 0) {
        // One character of padding is at most 3 NULs; bound the scan so a binary file that merely
        // happens to open with those two bytes is not searched indefinitely for a `<`.
        const limit = Math.min(buffer.length, wideBomLength + 8);
        let wide = wideBomLength;
        while (wide < limit && (buffer[wide] === 0x00 || isWhitespace(buffer[wide]))) {
            wide++;
        }
        return buffer[wide] === LESS_THAN;
    }
    // UTF-8 (optional BOM): first non-whitespace byte is `<`.
    let index = startsWith(0xef, 0xbb, 0xbf) ? 3 : 0;
    while (index < buffer.length && isWhitespace(buffer[index])) {
        index++;
    }
    return buffer[index] === LESS_THAN;
}
/**
 * Largest stored upload that is read back in full for the markup check.
 *
 * The check only ever inspects the first few bytes, but the storage providers expose whole-object
 * reads (`getFile`) with no ranged variant, so scanning a 2 GB video would mean holding it in
 * memory on the request path. Beyond this size the scan is skipped and the extension allowlist in
 * {@link createUploadFileFilter} carries the protection on its own — which it can, because
 * `/public` derives `Content-Type` from the stored extension and sends `nosniff`, so a `.mp4` is
 * never executed as markup whatever its bytes contain.
 */
exports.MARKUP_SCAN_MAX_BYTES = 5 * 1024 * 1024;
/**
 * Whether an upload of the given size should be read back and scanned for markup.
 *
 * @param size - The stored size in bytes, if known. An unknown size is scanned.
 * @returns `true` when the file is small enough to read in full.
 */
function shouldScanForMarkup(size) {
    // `Number.isFinite` is already false for a non-number, so it covers the unknown-size case too.
    return !Number.isFinite(size) || size <= exports.MARKUP_SCAN_MAX_BYTES;
}
/**
 * Throws a {@link BadRequestException} when the stored bytes are markup.
 *
 * Call this after the file has been written but before any database record is created, so a
 * rejected upload leaves nothing behind — `/public` serves straight from disk whether or not the
 * record exists.
 *
 * @param content - The raw stored bytes to inspect.
 * @throws BadRequestException when the content appears to be markup.
 */
function assertNotMarkupContent(content) {
    if (isMarkupContent(content)) {
        throw new common_1.BadRequestException('Unsupported file content: markup/script files are not allowed');
    }
}
/**
 * Extensions that a browser will happily execute or render inline when the object is fetched from a
 * provider's unauthenticated `/public/` path — which would turn an upload endpoint into a
 * same-origin XSS sink (GHSA-p334-cm7f-php5).
 *
 * This is about the STORED OBJECT NAME, not what the user may upload: the real content type is kept
 * on the record and the bytes are served through an authenticated route, so mapping the stored
 * extension to `bin` costs the client nothing. Sniffing is unaffected — it reads the ORIGINAL
 * filename, not the storage key.
 */
exports.RENDERABLE_KEY_EXTENSIONS = new Set([
    'html',
    'htm',
    'xhtml',
    'xml',
    'svg',
    'svgz',
    'js',
    'mjs',
    'css'
]);
/**
 * The extension to use in a storage key, given a client-supplied one.
 *
 * Shared by every provider-backed upload endpoint on purpose: this policy was duplicated in the
 * Documents and AI-chat controllers, so hardening one left the other exposed.
 *
 * @param extension - The extension taken from the uploaded filename.
 * @returns A lower-case alphanumeric extension, or '' when there is nothing usable.
 */
function toSafeStorageExtension(extension) {
    const safeExtension = String(extension ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    if (!safeExtension) {
        return '';
    }
    return exports.RENDERABLE_KEY_EXTENSIONS.has(safeExtension) ? 'bin' : safeExtension;
}
//# sourceMappingURL=upload-security.js.map