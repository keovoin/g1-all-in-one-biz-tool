import { ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Minimal pdfjs-dist wrapper (`01-ux-spec.md` §9): renders one page at a time
 * to a canvas with page navigation and zoom. The library (and its worker
 * module) loads through a dynamic import so pdfjs never ships in the browse
 * chunk; when worker creation fails, the main-thread module registered as
 * `globalThis.pdfjsWorker` drives pdf.js's fake-worker path.
 */
export declare class PdfViewerComponent implements OnChanges, OnDestroy {
    src: Blob | null;
    /** 1-based page to open on (citation locator support). */
    initialPage: number;
    loaded: EventEmitter<{
        totalPages: number;
    }>;
    renderFailed: EventEmitter<void>;
    pageChanged: EventEmitter<{
        page: number;
        totalPages: number;
    }>;
    canvasRef: ElementRef<HTMLCanvasElement>;
    loading: boolean;
    page: number;
    totalPages: number;
    scale: number;
    private pdf;
    private destroyed;
    ngOnChanges(changes: SimpleChanges): Promise<void>;
    ngOnDestroy(): void;
    next(): Promise<void>;
    prev(): Promise<void>;
    zoomIn(): Promise<void>;
    zoomOut(): Promise<void>;
    private load;
    /** Dynamic import + worker setup; falls back to the main-thread fake worker. */
    private loadPdfjs;
    private renderPage;
    static ɵfac: i0.ɵɵFactoryDeclaration<PdfViewerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PdfViewerComponent, "gz-docs-pdf-viewer", never, { "src": { "alias": "src"; "required": false; }; "initialPage": { "alias": "initialPage"; "required": false; }; }, { "loaded": "loaded"; "renderFailed": "renderFailed"; "pageChanged": "pageChanged"; }, never, never, false, never>;
}
