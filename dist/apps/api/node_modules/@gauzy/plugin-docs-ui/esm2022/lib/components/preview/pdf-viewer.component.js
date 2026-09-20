import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
/**
 * Minimal pdfjs-dist wrapper (`01-ux-spec.md` §9): renders one page at a time
 * to a canvas with page navigation and zoom. The library (and its worker
 * module) loads through a dynamic import so pdfjs never ships in the browse
 * chunk; when worker creation fails, the main-thread module registered as
 * `globalThis.pdfjsWorker` drives pdf.js's fake-worker path.
 */
export class PdfViewerComponent {
    constructor() {
        this.src = null;
        /** 1-based page to open on (citation locator support). */
        this.initialPage = 1;
        this.loaded = new EventEmitter();
        this.renderFailed = new EventEmitter();
        this.pageChanged = new EventEmitter();
        this.loading = false;
        this.page = 1;
        this.totalPages = 0;
        this.scale = 1.25;
        this.pdf = null;
        this.destroyed = false;
    }
    async ngOnChanges(changes) {
        if (changes['src'] && this.src) {
            await this.load(this.src);
        }
    }
    ngOnDestroy() {
        this.destroyed = true;
        void this.pdf?.destroy();
        this.pdf = null;
    }
    // ─── Navigation / zoom (driven by the modal chrome) ──────────
    async next() {
        if (this.pdf && this.page < this.totalPages) {
            this.page++;
            await this.renderPage();
        }
    }
    async prev() {
        if (this.pdf && this.page > 1) {
            this.page--;
            await this.renderPage();
        }
    }
    async zoomIn() {
        this.scale = Math.min(4, this.scale + 0.25);
        await this.renderPage();
    }
    async zoomOut() {
        this.scale = Math.max(0.5, this.scale - 0.25);
        await this.renderPage();
    }
    // ─── Internals ───────────────────────────────────────────────
    async load(blob) {
        this.loading = true;
        try {
            const pdfjs = await this.loadPdfjs();
            const data = new Uint8Array(await blob.arrayBuffer());
            const document = (await pdfjs.getDocument({ data }).promise);
            if (this.destroyed) {
                void document.destroy();
                return;
            }
            this.pdf = document;
            this.totalPages = document.numPages;
            this.page = Math.min(Math.max(1, this.initialPage), this.totalPages);
            this.loaded.emit({ totalPages: this.totalPages });
            await this.renderPage();
        }
        catch {
            this.renderFailed.emit();
        }
        finally {
            this.loading = false;
        }
    }
    /** Dynamic import + worker setup; falls back to the main-thread fake worker. */
    async loadPdfjs() {
        const pdfjs = (await import('pdfjs-dist'));
        if (!pdfjs.GlobalWorkerOptions.workerSrc && !pdfjs.GlobalWorkerOptions.workerPort) {
            try {
                pdfjs.GlobalWorkerOptions.workerPort = new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url), { type: 'module' });
            }
            catch {
                // Registers globalThis.pdfjsWorker — pdf.js's fake worker picks it up.
                await import('pdfjs-dist/build/pdf.worker.min.mjs');
            }
        }
        return pdfjs;
    }
    async renderPage() {
        if (!this.pdf)
            return;
        try {
            const page = await this.pdf.getPage(this.page);
            const viewport = page.getViewport({ scale: this.scale });
            const canvas = this.canvasRef.nativeElement;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');
            if (!context)
                return;
            await page.render({ canvasContext: context, viewport, canvas }).promise;
            this.pageChanged.emit({ page: this.page, totalPages: this.totalPages });
        }
        catch {
            this.renderFailed.emit();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PdfViewerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PdfViewerComponent, isStandalone: false, selector: "gz-docs-pdf-viewer", inputs: { src: "src", initialPage: "initialPage" }, outputs: { loaded: "loaded", renderFailed: "renderFailed", pageChanged: "pageChanged" }, viewQueries: [{ propertyName: "canvasRef", first: true, predicate: ["canvas"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
		<div class="docs-pdf" [nbSpinner]="loading" nbSpinnerStatus="primary">
			<div class="docs-pdf-canvas-host">
				<canvas #canvas></canvas>
			</div>
		</div>
	`, isInline: true, styles: [":host{display:block;height:100%}.docs-pdf{height:100%;overflow:auto;text-align:center}canvas{max-width:100%;box-shadow:var(--shadow)}\n"], dependencies: [{ kind: "directive", type: i1.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PdfViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-pdf-viewer', template: `
		<div class="docs-pdf" [nbSpinner]="loading" nbSpinnerStatus="primary">
			<div class="docs-pdf-canvas-host">
				<canvas #canvas></canvas>
			</div>
		</div>
	`, standalone: false, styles: [":host{display:block;height:100%}.docs-pdf{height:100%;overflow:auto;text-align:center}canvas{max-width:100%;box-shadow:var(--shadow)}\n"] }]
        }], propDecorators: { src: [{
                type: Input
            }], initialPage: [{
                type: Input
            }], loaded: [{
                type: Output
            }], renderFailed: [{
                type: Output
            }], pageChanged: [{
                type: Output
            }], canvasRef: [{
                type: ViewChild,
                args: ['canvas', { static: true }]
            }] } });
//# sourceMappingURL=pdf-viewer.component.js.map