import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Page-wide drag & drop dropzone. Attach to the browse page root; emits the
 * dropped `File[]` and toggles a `docs-dropzone-active` class while a drag
 * hovers so the host can render the overlay hint.
 */
export declare class UploadDropzoneDirective {
    filesDropped: EventEmitter<File[]>;
    dragActiveChange: EventEmitter<boolean>;
    dragActive: boolean;
    private dragDepth;
    onDragEnter(event: DragEvent): void;
    onDragOver(event: DragEvent): void;
    onDragLeave(event: DragEvent): void;
    onDrop(event: DragEvent): void;
    private hasFiles;
    private setActive;
    static ɵfac: i0.ɵɵFactoryDeclaration<UploadDropzoneDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<UploadDropzoneDirective, "[gzDocsUploadDropzone]", never, {}, { "filesDropped": "filesDropped"; "dragActiveChange": "dragActiveChange"; }, never, never, false, never>;
}
