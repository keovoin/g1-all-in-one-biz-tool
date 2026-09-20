import { EventEmitter } from '@angular/core';
import { UploadQueueItem } from '../../services/upload-queue.service';
import * as i0 from "@angular/core";
/**
 * Per-file upload rows: name, size, progress bar, done/error state, retry,
 * dismiss and clear-finished.
 */
export declare class UploadProgressComponent {
    items: UploadQueueItem[] | null;
    retry: EventEmitter<string>;
    dismiss: EventEmitter<string>;
    clearFinished: EventEmitter<void>;
    trackByKey(_: number, item: UploadQueueItem): string;
    humanize(bytes: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<UploadProgressComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UploadProgressComponent, "gz-docs-upload-progress", never, { "items": { "alias": "items"; "required": false; }; }, { "retry": "retry"; "dismiss": "dismiss"; "clearFinished": "clearFinished"; }, never, never, false, never>;
}
