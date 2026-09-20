import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { renderToHTMLString } from '@tiptap/static-renderer';
import { firstValueFrom } from 'rxjs';
import { DocumentsService } from '../../services/documents.service';
import { createStaticExtensions } from '../extensions/document-extensions';
import { renderMarkdownToSanitizedHtml, sanitizeHtml } from './markdown-render.util';
import { parseRawDocumentId } from './raw-image.util';
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
export class DocumentStaticViewComponent {
    constructor() {
        /** Canonical TipTap JSON (preferred input). */
        this.contentJson = null;
        /** Server-sanitized render cache fallback. */
        this.contentHtml = null;
        /** FILE extracted-text markdown preview. */
        this.markdown = null;
        this.sanitizer = inject(DomSanitizer);
        this.documentsService = inject(DocumentsService);
        this.platformId = inject(PLATFORM_ID);
        /** Sanitized HTML, bound with `[innerHTML]` so Angular sanitizes it again on binding. */
        this.safeHtml = null;
        /** Object URLs minted for this render — revoked whenever the content changes. */
        this.objectUrls = [];
        /** Set by `ngOnChanges`, consumed once by the next `ngAfterViewChecked`. */
        this.pendingImageSwap = false;
        /**
         * Bumped by every render. A blob that arrives after the inputs changed belongs to
         * content that is no longer on screen and must not be written into the new DOM.
         */
        this.renderSession = 0;
    }
    ngOnChanges() {
        this.releaseObjectUrls();
        this.renderSession += 1;
        this.safeHtml = this.render();
        this.pendingImageSwap = !!this.safeHtml && isPlatformBrowser(this.platformId);
    }
    ngAfterViewChecked() {
        if (!this.pendingImageSwap)
            return;
        this.pendingImageSwap = false;
        void this.resolveEmbeddedImages(this.renderSession);
    }
    ngOnDestroy() {
        this.releaseObjectUrls();
    }
    render() {
        if (this.contentJson) {
            try {
                return sanitizeHtml(renderToHTMLString({
                    extensions: createStaticExtensions(),
                    content: this.contentJson
                }), this.sanitizer);
            }
            catch {
                return sanitizeHtml(this.contentHtml, this.sanitizer);
            }
        }
        if (this.markdown) {
            // Same renderer the file preview modal uses (`markdown-render.util.ts`).
            return renderMarkdownToSanitizedHtml(this.markdown, this.sanitizer);
        }
        return sanitizeHtml(this.contentHtml, this.sanitizer);
    }
    /**
     * Swaps every `/raw` image in the rendered DOM for an authenticated object URL.
     *
     * Read with `getAttribute('src')` rather than `img.src`: the property resolves to an
     * absolute URL, and the authored value is what carries the plugin path. Each id is
     * fetched once even when the same image appears several times. Failures are left alone
     * — the browser's own broken-image state is the honest outcome for a deleted document.
     */
    async resolveEmbeddedImages(session) {
        const host = this.hostRef?.nativeElement;
        if (!host)
            return;
        const images = Array.from(host.querySelectorAll('img'));
        const byDocumentId = new Map();
        for (const image of images) {
            const documentId = parseRawDocumentId(image.getAttribute('src'));
            if (!documentId)
                continue;
            const group = byDocumentId.get(documentId) ?? [];
            group.push(image);
            byDocumentId.set(documentId, group);
        }
        await Promise.all([...byDocumentId].map(async ([documentId, targets]) => {
            try {
                const blob = await firstValueFrom(this.documentsService.getRawBlob(documentId));
                if (session !== this.renderSession)
                    return;
                const objectUrl = URL.createObjectURL(blob);
                this.objectUrls.push(objectUrl);
                targets.forEach((image) => image.setAttribute('src', objectUrl));
            }
            catch {
                // Deleted document / revoked access — nothing to bind.
            }
        }));
    }
    releaseObjectUrls() {
        this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
        this.objectUrls = [];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentStaticViewComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocumentStaticViewComponent, isStandalone: true, selector: "gz-document-static-view", inputs: { contentJson: "contentJson", contentHtml: "contentHtml", markdown: "markdown" }, viewQueries: [{ propertyName: "hostRef", first: true, predicate: ["host"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `<div #host class="gz-static-view ProseMirror" [innerHTML]="safeHtml"></div>`, isInline: true, styles: [":host{display:block}.gz-static-view{line-height:1.6}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentStaticViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-document-static-view', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: `<div #host class="gz-static-view ProseMirror" [innerHTML]="safeHtml"></div>`, styles: [":host{display:block}.gz-static-view{line-height:1.6}\n"] }]
        }], propDecorators: { contentJson: [{
                type: Input
            }], contentHtml: [{
                type: Input
            }], markdown: [{
                type: Input
            }], hostRef: [{
                type: ViewChild,
                args: ['host']
            }] } });
//# sourceMappingURL=document-static-view.component.js.map