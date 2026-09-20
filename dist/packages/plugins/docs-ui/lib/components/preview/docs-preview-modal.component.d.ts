import { OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbDialogRef } from '@nebular/theme';
import { Actions } from '@ngneat/effects-ng';
import { TranslateService } from '@ngx-translate/core';
import { IDocument } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsService } from '../../services/documents.service';
import { PdfViewerComponent } from './pdf-viewer.component';
import * as i0 from "@angular/core";
/** Citation locator passed when the preview opens from an AI answer (spec 07). */
export interface IDocsPreviewLocator {
    page?: number;
    headingPath?: string[];
    snippet?: string;
}
export type DocsPreviewViewer = 'pdf' | 'image' | 'video' | 'audio' | 'text' | 'extracted' | 'fallback';
/**
 * Full-screen per-mime preview (`01-ux-spec.md` §9): pdf (pdfjs wrapper),
 * images, video/audio (native tags), markdown/extracted-text (sanitized
 * `marked` render — same pipeline as the editor's static markdown path, kept
 * local so `@tiptap/*` stays out of the browse chunk), and a graceful download
 * fallback card. Binary content is fetched through the authenticated HTTP
 * client and served from object URLs. `Esc` closes (Nebular), `←`/`→` page
 * through a pdf.
 */
export declare class DocsPreviewModalComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    private readonly sanitizer;
    private readonly actions;
    document: IDocument;
    locator: IDocsPreviewLocator | null;
    pdfViewer: PdfViewerComponent | undefined;
    viewer: DocsPreviewViewer;
    loading: boolean;
    blob: Blob | null;
    /**
     * The `blob:` object URL for the img/video/audio viewers, bound as a plain string.
     *
     * Not wrapped in `bypassSecurityTrustUrl`: `URL.createObjectURL` always returns
     * `blob:<origin>/<uuid>`, which Angular's URL sanitizer passes through untouched. The
     * bypass was therefore doing nothing except disabling the check that would catch this
     * binding if the source of the URL ever changed to something attacker-influenced.
     *
     * 🛑 And Angular's check alone would not be enough if it did: it rejects `javascript:` and
     * nothing else, so `data:text/html`/`vbscript:` would sail into `<img|video|audio [src]>`.
     * The value is therefore assigned through `sanitizeMediaUrl`, the app's scheme allowlist.
     */
    mediaUrl: string | null;
    /** Sanitized HTML, bound with `[innerHTML]` so Angular sanitizes it again on binding. */
    textHtml: string | null;
    plainText: string | null;
    pdfPage: number;
    pdfTotal: number;
    /** True while the signed download URL is being resolved. */
    downloading: boolean;
    private objectUrl;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<DocsPreviewModalComponent>, documentsService: DocumentsService, sanitizer: DomSanitizer, actions: Actions);
    ngOnInit(): void;
    ngOnDestroy(): void;
    close(): void;
    /**
     * 🛑 `GET /:id/download` answers `{ url }` **as JSON behind the JWT guard** — it
     * is not a redirect, so it can only be reached through the authenticated
     * `HttpClient`. Navigating to the route directly sent no bearer token and put a
     * 401 page in the new tab, which also made the fallback card's primary button
     * (the only way to get the bytes for an unpreviewable file) dead.
     */
    download(): Promise<void>;
    openDetails(): void;
    onArrowRight(): void;
    onArrowLeft(): void;
    onPdfPage(event: {
        page: number;
        totalPages: number;
    }): void;
    /** Any render failure degrades to the download card. */
    onRenderFailed(): void;
    humanizeSize(bytes?: number): string;
    /** MIME family → renderer, falling back to the `originalFilename` extension. */
    private resolveViewer;
    private loadContent;
    /**
     * Markdown goes through the editor's shared read-only render util
     * (`marked` → Angular's HTML sanitizer — never raw HTML injection), so the
     * preview and the page read view render identical output. Plain text and CSV
     * stay pre-formatted rather than being parsed as markdown.
     */
    private renderText;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsPreviewModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsPreviewModalComponent, "gz-docs-preview-modal", never, { "document": { "alias": "document"; "required": false; }; "locator": { "alias": "locator"; "required": false; }; }, {}, never, never, false, never>;
}
