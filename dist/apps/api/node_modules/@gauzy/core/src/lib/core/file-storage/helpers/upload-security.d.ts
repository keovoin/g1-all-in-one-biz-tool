/**
 * Extensions that are never safe to store, because uploads are served unauthenticated from
 * `/public/<key>` with a `Content-Type` derived from the on-disk extension. A file stored as
 * `.svg`/`.html` is therefore served as active content and executes script in the application's
 * origin — stored XSS (GHSA-p334-cm7f-php5).
 */
export declare const BLOCKED_UPLOAD_EXTENSIONS: readonly [".svg", ".svgz", ".html", ".htm", ".xml", ".xhtml"];
/** Raster image MIME types accepted by the image upload endpoints. */
export declare const ALLOWED_IMAGE_MIME_TYPES: readonly ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/bmp"];
/** Extensions accepted by the image upload endpoints. */
export declare const ALLOWED_IMAGE_EXTENSIONS: readonly [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"];
/** Video MIME types accepted by the video upload endpoints. */
export declare const ALLOWED_VIDEO_MIME_TYPES: readonly ["video/mp4", "video/webm"];
/** Extensions accepted by the video upload endpoints. */
export declare const ALLOWED_VIDEO_EXTENSIONS: readonly [".mp4", ".webm"];
/** Audio MIME types accepted by the audio upload endpoints. */
export declare const ALLOWED_AUDIO_MIME_TYPES: readonly ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/webm", "audio/ogg"];
/** Extensions accepted by the audio upload endpoints. */
export declare const ALLOWED_AUDIO_EXTENSIONS: readonly [".mp3", ".wav", ".webm", ".weba", ".ogg", ".oga", ".m4a"];
/** Signature of the `fileFilter` callback multer expects. */
export type MulterFileFilterCallback = (error: Error | null, acceptFile: boolean) => void;
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
export declare function createUploadFileFilter(allowedMimeTypes: readonly string[], allowedExtensions: readonly string[]): (_req: any, file: any, callback: MulterFileFilterCallback) => void;
/** Multer `fileFilter` accepting only raster images. */
export declare const imageUploadFileFilter: (_req: any, file: any, callback: MulterFileFilterCallback) => void;
/** Multer `fileFilter` accepting only video files. */
export declare const videoUploadFileFilter: (_req: any, file: any, callback: MulterFileFilterCallback) => void;
/** Multer `fileFilter` accepting only audio files. */
export declare const audioUploadFileFilter: (_req: any, file: any, callback: MulterFileFilterCallback) => void;
/** MIME types browsers/clients send for a ZIP archive. */
export declare const ALLOWED_ARCHIVE_MIME_TYPES: readonly ["application/zip", "application/x-zip-compressed", "application/x-zip", "multipart/x-zip", "application/octet-stream"];
/** Extensions accepted by the archive (import) endpoints. */
export declare const ALLOWED_ARCHIVE_EXTENSIONS: readonly [".zip"];
/** Multer `fileFilter` accepting only ZIP archives (the data-import format). */
export declare const archiveUploadFileFilter: (_req: any, file: any, callback: MulterFileFilterCallback) => void;
/**
 * Extensions that are script-capable when served by extension yet have no legitimate use on the
 * open-ended DOCUMENT upload endpoints (chat attachments, knowledge ingestion): those endpoints must
 * accept `.html`/`.xml` (they are ingested), so an allowlist is impossible there and this is the
 * backstop for the rest. `/public` additionally serves every asset with `nosniff` + a `sandbox` CSP.
 */
export declare const SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS: readonly [".svg", ".svgz", ".xhtml", ".xht", ".mhtml", ".mht", ".xsl", ".xslt", ".shtml", ".shtm", ".hta", ".js", ".mjs", ".vbs", ".wsf"];
/**
 * Multer `fileFilter` for open-ended document uploads: refuses {@link SCRIPT_CAPABLE_NON_DOCUMENT_EXTENSIONS}
 * and accepts everything else. Callers still store the bytes behind `/public`'s `sandbox` CSP.
 */
export declare function documentUploadFileFilter(_req: unknown, file: {
    originalname?: string;
}, callback: MulterFileFilterCallback): void;
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
export declare function isMarkupContent(content: Buffer | string): boolean;
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
export declare const MARKUP_SCAN_MAX_BYTES: number;
/**
 * Whether an upload of the given size should be read back and scanned for markup.
 *
 * @param size - The stored size in bytes, if known. An unknown size is scanned.
 * @returns `true` when the file is small enough to read in full.
 */
export declare function shouldScanForMarkup(size?: number): boolean;
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
export declare function assertNotMarkupContent(content: Buffer | string): void;
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
export declare const RENDERABLE_KEY_EXTENSIONS: ReadonlySet<string>;
/**
 * The extension to use in a storage key, given a client-supplied one.
 *
 * Shared by every provider-backed upload endpoint on purpose: this policy was duplicated in the
 * Documents and AI-chat controllers, so hardening one left the other exposed.
 *
 * @param extension - The extension taken from the uploaded filename.
 * @returns A lower-case alphanumeric extension, or '' when there is nothing usable.
 */
export declare function toSafeStorageExtension(extension: string | undefined | null): string;
