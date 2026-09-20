/** Render scale for OCR/thumbnail rasterization — 150 DPI against the PDF's 72 dpi user space. */
export declare const PDF_RASTER_DPI = 150;
/** Longest side a rendered page is allowed to reach, in pixels (memory fuse per page). */
export declare const PDF_RASTER_MAX_PX = 2200;
/** What one rasterization run produced. */
export interface IPdfRasterResult {
    /** PNG bytes, one per rendered page, in page order. */
    pages: Buffer[];
    /** Total pages in the document — may exceed `pages.length` when a cap was applied. */
    pageCount: number;
}
/**
 * PDF → PNG page rasterization, used by BOTH consumers that need pixels out of a PDF:
 * the OCR path (every page, capped) and the thumbnail path (page 1 only).
 *
 * 🛑 **The renderer is an OPTIONAL runtime dependency, deliberately.** `sharp` — which the
 * plugin already ships — cannot help here: the prebuilt libvips advertises a `pdf` format but
 * with `input: { file: false, buffer: false }`, i.e. no poppler/pdfium was compiled in, so a
 * PDF buffer is simply not loadable. Actually rasterizing needs `pdfjs-dist` plus a native
 * canvas (`@napi-rs/canvas`, which `pdfjs-dist` itself declares as an optional dependency).
 * Making those *hard* dependencies of the backend plugin would force a per-platform native
 * binary into every Gauzy API install for two cosmetic/opt-in features, so they are loaded the
 * same defensive way `DocsAiService` loads `@gauzy/plugin-ai-chat`: try, cache, and report
 * "unavailable" forever after a failure.
 *
 * Unavailable is never an error here — it is a capability answer:
 * - thumbnails skip the PDF (the UI falls back to the kind icon);
 * - scanned-PDF OCR reports "not available", so the document keeps today's permanent
 *   extraction failure instead of silently changing behavior.
 *
 * Image OCR needs none of this — it runs on `sharp` alone.
 */
export declare class PdfRasterizerService {
    private readonly logger;
    /** `undefined` = not tried yet, `null` = tried and unavailable. */
    private renderer?;
    /**
     * True when a PDF renderer could be loaded in this process.
     *
     * @returns Whether {@link renderPages} can produce anything.
     */
    isAvailable(): Promise<boolean>;
    /**
     * Renders the leading pages of a PDF to PNG buffers.
     *
     * @param buffer The PDF bytes.
     * @param maxPages Maximum pages to render (>= 1). Remaining pages are reported through
     *                 `pageCount` so the caller can emit an honest truncation note.
     * @returns The rendered pages, or `null` when no renderer is available in this process.
     * @throws DocsTransientError when the renderer itself fails mid-run (a retry may succeed).
     */
    renderPages(buffer: Buffer, maxPages: number): Promise<IPdfRasterResult | null>;
    /**
     * Renders exactly one page to PNG bytes at {@link PDF_RASTER_DPI}, clamped so no single
     * page can allocate an unbounded canvas.
     */
    private renderPage;
    /**
     * Loads `pdfjs-dist` + `@napi-rs/canvas` once, caching both the success and the failure.
     *
     * `pdfjs-dist` v4 ships ESM only, and this package compiles to CommonJS — so the loader
     * mirrors `@gauzy/plugin-ai-chat`'s ESM interop: `require(esm)` first (native on Node >=
     * 22.12), then a genuine dynamic `import()` built through the `Function` constructor so
     * TypeScript cannot rewrite it back into a `require`.
     */
    private loadRenderer;
}
