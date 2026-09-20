import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Page-wide drag & drop dropzone. Attach to the browse page root; emits the
 * dropped `File[]` and toggles a `docs-dropzone-active` class while a drag
 * hovers so the host can render the overlay hint.
 */
export class UploadDropzoneDirective {
    constructor() {
        this.filesDropped = new EventEmitter();
        this.dragActiveChange = new EventEmitter();
        this.dragActive = false;
        this.dragDepth = 0;
    }
    onDragEnter(event) {
        if (!this.hasFiles(event))
            return;
        event.preventDefault();
        this.dragDepth++;
        this.setActive(true);
    }
    onDragOver(event) {
        if (!this.hasFiles(event))
            return;
        event.preventDefault();
    }
    onDragLeave(event) {
        if (!this.hasFiles(event))
            return;
        event.preventDefault();
        this.dragDepth = Math.max(0, this.dragDepth - 1);
        if (this.dragDepth === 0)
            this.setActive(false);
    }
    onDrop(event) {
        if (!this.hasFiles(event))
            return;
        event.preventDefault();
        this.dragDepth = 0;
        this.setActive(false);
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length)
            this.filesDropped.emit(files);
    }
    hasFiles(event) {
        return !!event.dataTransfer?.types?.includes('Files');
    }
    setActive(active) {
        if (this.dragActive !== active) {
            this.dragActive = active;
            this.dragActiveChange.emit(active);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UploadDropzoneDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: UploadDropzoneDirective, isStandalone: false, selector: "[gzDocsUploadDropzone]", outputs: { filesDropped: "filesDropped", dragActiveChange: "dragActiveChange" }, host: { listeners: { "dragenter": "onDragEnter($event)", "dragover": "onDragOver($event)", "dragleave": "onDragLeave($event)", "drop": "onDrop($event)" }, properties: { "class.docs-dropzone-active": "this.dragActive" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UploadDropzoneDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gzDocsUploadDropzone]',
                    standalone: false
                }]
        }], propDecorators: { filesDropped: [{
                type: Output
            }], dragActiveChange: [{
                type: Output
            }], dragActive: [{
                type: HostBinding,
                args: ['class.docs-dropzone-active']
            }], onDragEnter: [{
                type: HostListener,
                args: ['dragenter', ['$event']]
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], onDragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });
//# sourceMappingURL=upload-dropzone.directive.js.map