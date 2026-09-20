import { OnDestroy } from '@angular/core';
import { Editor } from '@tiptap/core';
import { ID } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export type EditorUploadStatus = 'uploading' | 'error';
export interface IEditorUpload {
    uploadId: string;
    file: File;
    kind: 'image' | 'file';
    status: EditorUploadStatus;
    progress: number;
    objectUrl?: string;
    error?: string;
}
/**
 * Editor image/file upload pipeline (spec 05 §6.6):
 * intercept → validate → placeholder insert (blob preview / attachment card
 * with transient `uploadId`) → `POST /documents/upload` (`source: EDITOR`,
 * `parentId` = the page id) → one-transaction placeholder→final swap.
 * Base64 never enters the doc; autosave skips while `hasPending`.
 */
export declare class EditorUploadService implements OnDestroy {
    private readonly documentsService;
    private readonly toastrService;
    private readonly translate;
    private readonly zone;
    private readonly uploads;
    /** The still-open HTTP request behind each in-flight upload, keyed by `uploadId`. */
    private readonly requests;
    /**
     * Bumped by every `destroy()`. The editor this service dispatches into is torn
     * down and rebuilt whenever the `page/:id` route changes, so a response that
     * arrives afterwards belongs to a session whose `Editor` — and whose ProseMirror
     * view — no longer exists. Mirrors `DocumentAutosaveService`'s session guard.
     */
    private session;
    private readonly _pendingCount$;
    /** Number of in-flight or failed placeholders still in the doc. */
    readonly pendingCount$: import("rxjs").Observable<number>;
    /** The PAGE document uploads attach under (child FILE documents). */
    parentDocumentId: ID | null;
    /** Org max file size — refreshed from settings by the page component. */
    maxFileSizeBytes: number;
    get hasPending(): boolean;
    getUpload(uploadId: string | null | undefined): IEditorUpload | undefined;
    /** FileHandler onDrop/onPaste + slash/file-picker entry point. */
    handleFiles(editor: Editor, files: File[] | FileList, pos?: number): void;
    retry(editor: Editor, uploadId: string): void;
    remove(editor: Editor, uploadId: string): void;
    /**
     * Tears the pipeline down for the editor being destroyed (component destroy, or a
     * `page/:id` rebuild). Revoking the object URLs is not enough on its own: an
     * un-cancelled request answers into `swap()`/`fail()`, which dispatch straight at
     * `editor.view` — by then a destroyed ProseMirror view belonging to another
     * document. Cancel first, then drop the placeholders.
     */
    destroy(): void;
    /** Provided per `gz-document-editor`; Angular destroys it with the component. */
    ngOnDestroy(): void;
    private validate;
    private startUpload;
    private performUpload;
    /**
     * True once this upload's response can no longer be applied: the editor was torn
     * down (`destroy()` bumped the session), or the page moved to another document.
     */
    private isStale;
    private cancelRequest;
    /** Flips a placeholder to its retryable error state and re-renders its node view. */
    private fail;
    /** One transaction swaps placeholder attrs to the final child-FILE document (spec 05 §6.6 step 5). */
    private swap;
    private findByUploadId;
    private emitPending;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditorUploadService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EditorUploadService>;
}
/**
 * Persist-safe deep copy of the doc JSON (spec 05 §6.6): drops transient
 * `uploadId` attrs, removes `image` nodes whose `src` is still a blob/data URL
 * and `fileAttachment` placeholders without a `documentId`.
 */
export declare function sanitizeContentJson(json: unknown): unknown;
