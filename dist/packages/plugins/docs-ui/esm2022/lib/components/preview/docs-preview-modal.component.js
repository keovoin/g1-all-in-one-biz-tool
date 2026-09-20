import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbDialogRef } from '@nebular/theme';
import { Actions } from '@ngneat/effects-ng';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DocumentKindEnum } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocumentsActions } from '../../+state/documents.actions';
import { renderMarkdownToSanitizedHtml } from '../../editor/read-only/markdown-render.util';
import { sanitizeMediaUrl } from '../../editor/read-only/safe-url.util';
import { DocumentsService } from '../../services/documents.service';
import { PdfViewerComponent } from './pdf-viewer.component';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../../services/documents.service";
import * as i4 from "@angular/platform-browser";
import * as i5 from "@ngneat/effects-ng";
import * as i6 from "@angular/common";
import * as i7 from "@gauzy/ui-core/shared";
import * as i8 from "./pdf-viewer.component";
/**
 * Full-screen per-mime preview (`01-ux-spec.md` §9): pdf (pdfjs wrapper),
 * images, video/audio (native tags), markdown/extracted-text (sanitized
 * `marked` render — same pipeline as the editor's static markdown path, kept
 * local so `@tiptap/*` stays out of the browse chunk), and a graceful download
 * fallback card. Binary content is fetched through the authenticated HTTP
 * client and served from object URLs. `Esc` closes (Nebular), `←`/`→` page
 * through a pdf.
 */
export class DocsPreviewModalComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, documentsService, sanitizer, actions) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.documentsService = documentsService;
        this.sanitizer = sanitizer;
        this.actions = actions;
        this.locator = null;
        this.viewer = 'fallback';
        this.loading = false;
        this.blob = null;
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
        this.mediaUrl = null;
        /** Sanitized HTML, bound with `[innerHTML]` so Angular sanitizes it again on binding. */
        this.textHtml = null;
        this.plainText = null;
        this.pdfPage = 0;
        this.pdfTotal = 0;
        /** True while the signed download URL is being resolved. */
        this.downloading = false;
        this.objectUrl = null;
    }
    ngOnInit() {
        this.viewer = this.resolveViewer();
        void this.loadContent();
    }
    ngOnDestroy() {
        if (this.objectUrl)
            URL.revokeObjectURL(this.objectUrl);
    }
    // ─── Chrome actions ──────────────────────────────────────────
    close() {
        this.dialogRef.close();
    }
    /**
     * 🛑 `GET /:id/download` answers `{ url }` **as JSON behind the JWT guard** — it
     * is not a redirect, so it can only be reached through the authenticated
     * `HttpClient`. Navigating to the route directly sent no bearer token and put a
     * 401 page in the new tab, which also made the fallback card's primary button
     * (the only way to get the bytes for an unpreviewable file) dead.
     */
    async download() {
        if (!this.document || this.downloading)
            return;
        this.downloading = true;
        try {
            const url = await firstValueFrom(this.documentsService.getDownloadUrl(this.document.id));
            if (url)
                window.open(url, '_blank', 'noopener');
        }
        catch {
            // The card already states the file could not be rendered; a failed URL
            // resolve leaves it exactly as it was.
        }
        finally {
            this.downloading = false;
        }
    }
    openDetails() {
        this.actions.dispatch(DocumentsActions.detailOpened(this.document.id));
        this.dialogRef.close();
    }
    onArrowRight() {
        void this.pdfViewer?.next();
    }
    onArrowLeft() {
        void this.pdfViewer?.prev();
    }
    onPdfPage(event) {
        this.pdfPage = event.page;
        this.pdfTotal = event.totalPages;
    }
    /** Any render failure degrades to the download card. */
    onRenderFailed() {
        this.viewer = 'fallback';
    }
    humanizeSize(bytes) {
        if (!bytes || bytes <= 0)
            return '';
        const units = ['B', 'KB', 'MB', 'GB'];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
    }
    // ─── Viewer resolution / loading ─────────────────────────────
    /** MIME family → renderer, falling back to the `originalFilename` extension. */
    resolveViewer() {
        const doc = this.document;
        if (!doc || doc.kind !== DocumentKindEnum.FILE)
            return 'fallback';
        const mime = (doc.mimeType ?? '').toLowerCase();
        const ext = (doc.originalFilename ?? doc.name ?? '').split('.').pop()?.toLowerCase() ?? '';
        if (mime === 'application/pdf' || ext === 'pdf')
            return 'pdf';
        if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext))
            return 'image';
        if (mime.startsWith('video/'))
            return 'video';
        if (mime.startsWith('audio/'))
            return 'audio';
        if (['text/markdown', 'text/plain', 'text/csv', 'text/html'].includes(mime) ||
            ['md', 'txt', 'csv', 'html'].includes(ext)) {
            return 'text';
        }
        // Office formats render from the extracted markdown with a notice.
        if (mime.includes('word') ||
            mime.includes('spreadsheet') ||
            mime.includes('presentation') ||
            mime.includes('opendocument') ||
            mime.includes('excel') ||
            ['docx', 'xlsx', 'pptx', 'odt', 'ods'].includes(ext)) {
            return 'extracted';
        }
        return 'fallback';
    }
    async loadContent() {
        this.loading = true;
        try {
            switch (this.viewer) {
                case 'pdf':
                case 'image':
                case 'video':
                case 'audio': {
                    this.blob = await firstValueFrom(this.documentsService.getRawBlob(this.document.id));
                    this.objectUrl = URL.createObjectURL(this.blob);
                    this.mediaUrl = sanitizeMediaUrl(this.objectUrl);
                    break;
                }
                case 'text':
                case 'extracted': {
                    const result = await firstValueFrom(this.documentsService.getExtractedText(this.document.id));
                    this.renderText(result?.extractedText ?? '');
                    break;
                }
            }
        }
        catch {
            this.viewer = 'fallback';
        }
        finally {
            this.loading = false;
        }
    }
    /**
     * Markdown goes through the editor's shared read-only render util
     * (`marked` → Angular's HTML sanitizer — never raw HTML injection), so the
     * preview and the page read view render identical output. Plain text and CSV
     * stay pre-formatted rather than being parsed as markdown.
     */
    renderText(text) {
        const mime = (this.document.mimeType ?? '').toLowerCase();
        if (this.viewer === 'text' && (mime === 'text/plain' || mime === 'text/csv')) {
            this.plainText = text;
            return;
        }
        this.textHtml = renderMarkdownToSanitizedHtml(text, this.sanitizer);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsPreviewModalComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.DocumentsService }, { token: i4.DomSanitizer }, { token: i5.Actions }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsPreviewModalComponent, isStandalone: false, selector: "gz-docs-preview-modal", inputs: { document: "document", locator: "locator" }, host: { listeners: { "document:keydown.arrowRight": "onArrowRight()", "document:keydown.arrowLeft": "onArrowLeft()" } }, viewQueries: [{ propertyName: "pdfViewer", first: true, predicate: PdfViewerComponent, descendants: true }], usesInheritance: true, ngImport: i0, template: "<nb-card class=\"docs-preview\">\n\t<nb-card-header class=\"docs-preview-header\">\n\t\t<div class=\"docs-preview-title\">\n\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t<span class=\"docs-preview-name\" [nbTooltip]=\"document?.originalFilename || document?.name\">\n\t\t\t\t{{ document?.name }}\n\t\t\t</span>\n\t\t\t<span class=\"docs-preview-pages\" *ngIf=\"viewer === 'pdf' && pdfTotal > 0\">\n\t\t\t\t{{ 'DOCS.PREVIEW.PAGE_OF' | translate : { page: pdfPage, total: pdfTotal } }}\n\t\t\t</span>\n\t\t</div>\n\t\t<div class=\"docs-preview-actions\">\n\t\t\t<ng-container *ngIf=\"viewer === 'pdf'\">\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.zoomOut()\" [nbTooltip]=\"'DOCS.PREVIEW.ZOOM_OUT' | translate\">\n\t\t\t\t\t<nb-icon icon=\"minus-circle-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.zoomIn()\" [nbTooltip]=\"'DOCS.PREVIEW.ZOOM_IN' | translate\">\n\t\t\t\t\t<nb-icon icon=\"plus-circle-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.prev()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.next()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</ng-container>\n\t\t\t<button nbButton ghost size=\"small\" [disabled]=\"downloading\" (click)=\"download()\">\n\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.DOWNLOAD' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton ghost size=\"small\" (click)=\"openDetails()\">\n\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.OPEN_DETAILS' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton ghost size=\"small\" class=\"docs-preview-close\" (click)=\"close()\">\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-header>\n\n\t<nb-card-body class=\"docs-preview-body\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t<ng-container [ngSwitch]=\"viewer\">\n\t\t\t<!-- PDF -->\n\t\t\t<gz-docs-pdf-viewer\n\t\t\t\t*ngSwitchCase=\"'pdf'\"\n\t\t\t\t[src]=\"blob\"\n\t\t\t\t[initialPage]=\"locator?.page || 1\"\n\t\t\t\t(pageChanged)=\"onPdfPage($event)\"\n\t\t\t\t(renderFailed)=\"onRenderFailed()\"\n\t\t\t></gz-docs-pdf-viewer>\n\n\t\t\t<!-- Image -->\n\t\t\t<div *ngSwitchCase=\"'image'\" class=\"docs-preview-media\">\n\t\t\t\t<img *ngIf=\"mediaUrl\" [src]=\"mediaUrl\" [alt]=\"document?.name\" (error)=\"onRenderFailed()\" />\n\t\t\t</div>\n\n\t\t\t<!-- Video -->\n\t\t\t<div *ngSwitchCase=\"'video'\" class=\"docs-preview-media\">\n\t\t\t\t<video *ngIf=\"mediaUrl\" [src]=\"mediaUrl\" controls (error)=\"onRenderFailed()\"></video>\n\t\t\t</div>\n\n\t\t\t<!-- Audio -->\n\t\t\t<div *ngSwitchCase=\"'audio'\" class=\"docs-preview-media\">\n\t\t\t\t<audio *ngIf=\"mediaUrl\" [src]=\"mediaUrl\" controls (error)=\"onRenderFailed()\"></audio>\n\t\t\t</div>\n\n\t\t\t<!-- Markdown / plain text -->\n\t\t\t<div *ngSwitchCase=\"'text'\" class=\"docs-preview-text\">\n\t\t\t\t<pre *ngIf=\"plainText !== null\">{{ plainText }}</pre>\n\t\t\t\t<div *ngIf=\"textHtml\" class=\"docs-preview-markdown\" [innerHTML]=\"textHtml\"></div>\n\t\t\t</div>\n\n\t\t\t<!-- Office formats: extracted markdown + notice -->\n\t\t\t<div *ngSwitchCase=\"'extracted'\" class=\"docs-preview-text\">\n\t\t\t\t<div class=\"docs-preview-notice\">\n\t\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t\t<span>{{ 'DOCS.PREVIEW.EXTRACTED_NOTICE' | translate }}</span>\n\t\t\t\t</div>\n\t\t\t\t<div *ngIf=\"textHtml\" class=\"docs-preview-markdown\" [innerHTML]=\"textHtml\"></div>\n\t\t\t</div>\n\n\t\t\t<!-- Fallback download card -->\n\t\t\t<div *ngSwitchDefault class=\"docs-preview-fallback\">\n\t\t\t\t<nb-icon icon=\"file-outline\" class=\"docs-preview-fallback-icon\"></nb-icon>\n\t\t\t\t<h6>{{ 'DOCS.PREVIEW.FALLBACK_TITLE' | translate }}</h6>\n\t\t\t\t<p>{{ 'DOCS.PREVIEW.FALLBACK_BODY' | translate }}</p>\n\t\t\t\t<p class=\"docs-preview-fallback-meta\">\n\t\t\t\t\t{{ document?.originalFilename || document?.name }}\n\t\t\t\t\t<span *ngIf=\"document?.fileSize\"> \u00B7 {{ humanizeSize(document?.fileSize) }}</span>\n\t\t\t\t</p>\n\t\t\t\t<button nbButton status=\"primary\" [disabled]=\"downloading\" (click)=\"download()\">\n\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.PREVIEW.DOWNLOAD' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</ng-container>\n\t</nb-card-body>\n</nb-card>\n", styles: [".docs-preview{width:90vw;height:90vh;max-width:80rem;margin:0;display:flex;flex-direction:column}.docs-preview-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.docs-preview-title{display:flex;align-items:center;gap:.5rem;min-width:0}.docs-preview-title .docs-preview-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.docs-preview-title .docs-preview-pages{font-size:.75rem;color:var(--text-hint-color);white-space:nowrap}.docs-preview-actions{display:flex;align-items:center;gap:.25rem;flex-shrink:0}.docs-preview-body{flex:1;overflow:auto;padding:1rem}.docs-preview-media{display:flex;align-items:center;justify-content:center;height:100%}.docs-preview-media img,.docs-preview-media video{max-width:100%;max-height:100%;object-fit:contain}.docs-preview-media audio{width:100%;max-width:32rem}.docs-preview-text{max-width:52rem;margin:0 auto}.docs-preview-text pre{white-space:pre-wrap;word-break:break-word;font-size:.8125rem}.docs-preview-notice{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem;padding:.375rem .625rem;border-radius:var(--border-radius);background:var(--background-basic-color-2);color:var(--text-hint-color);font-size:.8125rem}.docs-preview-markdown{line-height:1.6}.docs-preview-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;height:100%;text-align:center;color:var(--text-hint-color)}.docs-preview-fallback .docs-preview-fallback-icon{font-size:3rem}.docs-preview-fallback .docs-preview-fallback-meta{font-size:.8125rem}\n"], dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i6.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i6.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i7.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "component", type: i8.PdfViewerComponent, selector: "gz-docs-pdf-viewer", inputs: ["src", "initialPage"], outputs: ["loaded", "renderFailed", "pageChanged"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsPreviewModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-preview-modal', standalone: false, template: "<nb-card class=\"docs-preview\">\n\t<nb-card-header class=\"docs-preview-header\">\n\t\t<div class=\"docs-preview-title\">\n\t\t\t<nb-icon icon=\"eye-outline\"></nb-icon>\n\t\t\t<span class=\"docs-preview-name\" [nbTooltip]=\"document?.originalFilename || document?.name\">\n\t\t\t\t{{ document?.name }}\n\t\t\t</span>\n\t\t\t<span class=\"docs-preview-pages\" *ngIf=\"viewer === 'pdf' && pdfTotal > 0\">\n\t\t\t\t{{ 'DOCS.PREVIEW.PAGE_OF' | translate : { page: pdfPage, total: pdfTotal } }}\n\t\t\t</span>\n\t\t</div>\n\t\t<div class=\"docs-preview-actions\">\n\t\t\t<ng-container *ngIf=\"viewer === 'pdf'\">\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.zoomOut()\" [nbTooltip]=\"'DOCS.PREVIEW.ZOOM_OUT' | translate\">\n\t\t\t\t\t<nb-icon icon=\"minus-circle-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.zoomIn()\" [nbTooltip]=\"'DOCS.PREVIEW.ZOOM_IN' | translate\">\n\t\t\t\t\t<nb-icon icon=\"plus-circle-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.prev()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"pdfViewer?.next()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</ng-container>\n\t\t\t<button nbButton ghost size=\"small\" [disabled]=\"downloading\" (click)=\"download()\">\n\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.DOWNLOAD' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton ghost size=\"small\" (click)=\"openDetails()\">\n\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t{{ 'DOCS.PREVIEW.OPEN_DETAILS' | translate }}\n\t\t\t</button>\n\t\t\t<button nbButton ghost size=\"small\" class=\"docs-preview-close\" (click)=\"close()\">\n\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t</button>\n\t\t</div>\n\t</nb-card-header>\n\n\t<nb-card-body class=\"docs-preview-body\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t\t<ng-container [ngSwitch]=\"viewer\">\n\t\t\t<!-- PDF -->\n\t\t\t<gz-docs-pdf-viewer\n\t\t\t\t*ngSwitchCase=\"'pdf'\"\n\t\t\t\t[src]=\"blob\"\n\t\t\t\t[initialPage]=\"locator?.page || 1\"\n\t\t\t\t(pageChanged)=\"onPdfPage($event)\"\n\t\t\t\t(renderFailed)=\"onRenderFailed()\"\n\t\t\t></gz-docs-pdf-viewer>\n\n\t\t\t<!-- Image -->\n\t\t\t<div *ngSwitchCase=\"'image'\" class=\"docs-preview-media\">\n\t\t\t\t<img *ngIf=\"mediaUrl\" [src]=\"mediaUrl\" [alt]=\"document?.name\" (error)=\"onRenderFailed()\" />\n\t\t\t</div>\n\n\t\t\t<!-- Video -->\n\t\t\t<div *ngSwitchCase=\"'video'\" class=\"docs-preview-media\">\n\t\t\t\t<video *ngIf=\"mediaUrl\" [src]=\"mediaUrl\" controls (error)=\"onRenderFailed()\"></video>\n\t\t\t</div>\n\n\t\t\t<!-- Audio -->\n\t\t\t<div *ngSwitchCase=\"'audio'\" class=\"docs-preview-media\">\n\t\t\t\t<audio *ngIf=\"mediaUrl\" [src]=\"mediaUrl\" controls (error)=\"onRenderFailed()\"></audio>\n\t\t\t</div>\n\n\t\t\t<!-- Markdown / plain text -->\n\t\t\t<div *ngSwitchCase=\"'text'\" class=\"docs-preview-text\">\n\t\t\t\t<pre *ngIf=\"plainText !== null\">{{ plainText }}</pre>\n\t\t\t\t<div *ngIf=\"textHtml\" class=\"docs-preview-markdown\" [innerHTML]=\"textHtml\"></div>\n\t\t\t</div>\n\n\t\t\t<!-- Office formats: extracted markdown + notice -->\n\t\t\t<div *ngSwitchCase=\"'extracted'\" class=\"docs-preview-text\">\n\t\t\t\t<div class=\"docs-preview-notice\">\n\t\t\t\t\t<nb-icon icon=\"info-outline\"></nb-icon>\n\t\t\t\t\t<span>{{ 'DOCS.PREVIEW.EXTRACTED_NOTICE' | translate }}</span>\n\t\t\t\t</div>\n\t\t\t\t<div *ngIf=\"textHtml\" class=\"docs-preview-markdown\" [innerHTML]=\"textHtml\"></div>\n\t\t\t</div>\n\n\t\t\t<!-- Fallback download card -->\n\t\t\t<div *ngSwitchDefault class=\"docs-preview-fallback\">\n\t\t\t\t<nb-icon icon=\"file-outline\" class=\"docs-preview-fallback-icon\"></nb-icon>\n\t\t\t\t<h6>{{ 'DOCS.PREVIEW.FALLBACK_TITLE' | translate }}</h6>\n\t\t\t\t<p>{{ 'DOCS.PREVIEW.FALLBACK_BODY' | translate }}</p>\n\t\t\t\t<p class=\"docs-preview-fallback-meta\">\n\t\t\t\t\t{{ document?.originalFilename || document?.name }}\n\t\t\t\t\t<span *ngIf=\"document?.fileSize\"> \u00B7 {{ humanizeSize(document?.fileSize) }}</span>\n\t\t\t\t</p>\n\t\t\t\t<button nbButton status=\"primary\" [disabled]=\"downloading\" (click)=\"download()\">\n\t\t\t\t\t<nb-icon icon=\"download-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.PREVIEW.DOWNLOAD' | translate }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</ng-container>\n\t</nb-card-body>\n</nb-card>\n", styles: [".docs-preview{width:90vw;height:90vh;max-width:80rem;margin:0;display:flex;flex-direction:column}.docs-preview-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.docs-preview-title{display:flex;align-items:center;gap:.5rem;min-width:0}.docs-preview-title .docs-preview-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.docs-preview-title .docs-preview-pages{font-size:.75rem;color:var(--text-hint-color);white-space:nowrap}.docs-preview-actions{display:flex;align-items:center;gap:.25rem;flex-shrink:0}.docs-preview-body{flex:1;overflow:auto;padding:1rem}.docs-preview-media{display:flex;align-items:center;justify-content:center;height:100%}.docs-preview-media img,.docs-preview-media video{max-width:100%;max-height:100%;object-fit:contain}.docs-preview-media audio{width:100%;max-width:32rem}.docs-preview-text{max-width:52rem;margin:0 auto}.docs-preview-text pre{white-space:pre-wrap;word-break:break-word;font-size:.8125rem}.docs-preview-notice{display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem;padding:.375rem .625rem;border-radius:var(--border-radius);background:var(--background-basic-color-2);color:var(--text-hint-color);font-size:.8125rem}.docs-preview-markdown{line-height:1.6}.docs-preview-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;height:100%;text-align:center;color:var(--text-hint-color)}.docs-preview-fallback .docs-preview-fallback-icon{font-size:3rem}.docs-preview-fallback .docs-preview-fallback-meta{font-size:.8125rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.DocumentsService }, { type: i4.DomSanitizer }, { type: i5.Actions }], propDecorators: { document: [{
                type: Input
            }], locator: [{
                type: Input
            }], pdfViewer: [{
                type: ViewChild,
                args: [PdfViewerComponent]
            }], onArrowRight: [{
                type: HostListener,
                args: ['document:keydown.arrowRight']
            }], onArrowLeft: [{
                type: HostListener,
                args: ['document:keydown.arrowLeft']
            }] } });
//# sourceMappingURL=docs-preview-modal.component.js.map