import { IDocument } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/** What the caller already has in hand, so the service does not refetch it. */
export interface IDocsExportSource {
    /** Live editor markdown (`gz-document-editor.getMarkdown()`), when an editor is mounted. */
    markdown?: string | null;
    /** Live editor HTML, when an editor is mounted. */
    html?: string | null;
    /** Canonical TipTap JSON, when already loaded. */
    contentJson?: unknown | null;
}
/**
 * PAGE export surface (`01-ux-spec.md` §10.9, `05-editor-spec.md` §9.1/§9.3):
 * copy as Markdown, download `.md`, and print/PDF.
 *
 * 🛑 **Nothing here imports `@tiptap/*` at module scope.** Spec 05 §12 keeps the
 * whole editor stack behind the `page/:id` route, and this service is used from
 * the *detail panel*, which ships in the browse chunk. The JSON→Markdown path
 * therefore goes through a dynamic `import()` that only fires when a user
 * exports a page whose markdown was not already supplied by a mounted editor —
 * a static import would drag ProseMirror into the browse bundle.
 *
 * Print uses a same-origin hidden iframe rather than `window.open`: a popup
 * blocker silently eating the print window is indistinguishable from a broken
 * button, and an iframe needs no new route (spec 05 §9.1 calls for
 * "static-renderer HTML into a print-styled route + `window.print()`" — the
 * iframe *is* that document, minus the routing).
 */
export declare class DocsExportService {
    private readonly documentsService;
    private readonly sanitizer;
    /**
     * Resolves the Markdown body for a document.
     *
     * Order: caller-supplied editor markdown → caller-supplied/loaded
     * `contentJson` through the static renderer → FILE `extractedText`. Returns
     * an empty string when nothing is resolvable; callers treat that as "nothing
     * to export" rather than writing an empty file.
     */
    resolveMarkdown(document: IDocument, source?: IDocsExportSource): Promise<string>;
    /** Copies the Markdown body to the clipboard. Returns false when there was nothing to copy. */
    copyMarkdown(document: IDocument, source?: IDocsExportSource): Promise<boolean>;
    /** Downloads the Markdown body as `<slug>.md`. Returns false when there was nothing to write. */
    downloadMarkdown(document: IDocument, source?: IDocsExportSource): Promise<boolean>;
    /**
     * Renders the document into a hidden, print-styled iframe and calls
     * `print()` on it (the browser's "Save as PDF" is the PDF path in v1 — real
     * server-side PDF files are M5, spec 05 §16).
     *
     * Returns false when there is no renderable body.
     */
    print(document: IDocument, source?: IDocsExportSource): Promise<boolean>;
    /**
     * Resolves the print/render HTML: caller-supplied editor HTML → the server's
     * sanitized `contentHtml` render cache → static render of `contentJson` →
     * `extractedText` as preformatted text. Always re-sanitized here, because the
     * string ends up as `innerHTML` of a same-origin document.
     */
    resolveHtml(document: IDocument, source?: IDocsExportSource): Promise<string>;
    private loadContent;
    /** Dynamic import — see the class doc for why this is not a static import. */
    private renderJsonToMarkdown;
    private renderJsonToHtml;
    /**
     * The exported/printed document carries the same attacker-controlled content the read view
     * does, so it gets the same two passes: Angular's structural allowlist, then the app's URL
     * scheme allowlist — Angular's own URL check only rejects `javascript:`, which would leave a
     * `data:text/html` or `vbscript:` link live in the exported file (see `safe-url.util.ts`).
     */
    private sanitize;
    /**
     * HTML-escapes a text value. `&` is replaced FIRST so the escapes below cannot be
     * re-escaped, and the single quote is included so the result is safe in a single-quoted
     * attribute too — an escaper that covers only some of the characters in its class is the
     * bug this file should not repeat.
     */
    private escape;
    /** Print stylesheet mirrors the editor's reading column (spec 05 §9.1 tier 3). */
    private printDocument;
    private triggerDownload;
    /** Filesystem-safe filename stem; never empty. */
    private slug;
    /**
     * Strips leading and trailing `.`/`-` characters.
     *
     * Replaces `/^[.-]+|[.-]+$/g`, whose `[.-]+$` branch retried the trailing-run match from
     * every position inside the run and so cost O(n²) on a name made of dots (dots survive the
     * character filter above, and unlike dashes they are not collapsed by the `-{2,}` pass).
     * Two index walks touch each character at most once.
     */
    private trimDotsAndDashes;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsExportService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DocsExportService>;
}
