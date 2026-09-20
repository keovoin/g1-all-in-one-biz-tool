import { AfterViewChecked, OnChanges, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Static read-only render (spec 05 §9.1): TipTap JSON → HTML via
 * `@tiptap/static-renderer` (no editor, no ProseMirror view), used by the page
 * read view, version previews and print. Also renders FILE `extractedText`
 * markdown previews (via `marked`, the engine `@tiptap/markdown` builds on).
 * Everything passes through Angular's HTML sanitizer before binding.
 *
 * 🛑 Embedded images persist `/api/plugins/docs/documents/{id}/raw` as their `src`
 * — an authenticated, `DOCS_READ`-guarded stream whose JWT strategy reads the
 * Authorization header only. The browser sends no header for an `<img>`, so every
 * such image 401s. After each render the view re-points those images at object
 * URLs fetched through the authenticated `HttpClient`, exactly as the live
 * editor's `image` node view does; the bound HTML keeps the `/raw` reference.
 */
export declare class DocumentStaticViewComponent implements OnChanges, AfterViewChecked, OnDestroy {
    /** Canonical TipTap JSON (preferred input). */
    contentJson: unknown | null;
    /** Server-sanitized render cache fallback. */
    contentHtml: string | null;
    /** FILE extracted-text markdown preview. */
    markdown: string | null;
    private hostRef?;
    private readonly sanitizer;
    private readonly documentsService;
    private readonly platformId;
    /** Sanitized HTML, bound with `[innerHTML]` so Angular sanitizes it again on binding. */
    safeHtml: string | null;
    /** Object URLs minted for this render — revoked whenever the content changes. */
    private objectUrls;
    /** Set by `ngOnChanges`, consumed once by the next `ngAfterViewChecked`. */
    private pendingImageSwap;
    /**
     * Bumped by every render. A blob that arrives after the inputs changed belongs to
     * content that is no longer on screen and must not be written into the new DOM.
     */
    private renderSession;
    ngOnChanges(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    private render;
    /**
     * Swaps every `/raw` image in the rendered DOM for an authenticated object URL.
     *
     * Read with `getAttribute('src')` rather than `img.src`: the property resolves to an
     * absolute URL, and the authored value is what carries the plugin path. Each id is
     * fetched once even when the same image appears several times. Failures are left alone
     * — the browser's own broken-image state is the honest outcome for a deleted document.
     */
    private resolveEmbeddedImages;
    private releaseObjectUrls;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentStaticViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentStaticViewComponent, "gz-document-static-view", never, { "contentJson": { "alias": "contentJson"; "required": false; }; "contentHtml": { "alias": "contentHtml"; "required": false; }; "markdown": { "alias": "markdown"; "required": false; }; }, {}, never, never, true, never>;
}
