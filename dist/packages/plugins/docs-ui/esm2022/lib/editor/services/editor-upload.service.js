import { Injectable, NgZone, inject } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DocumentSourceEnum } from '@gauzy/contracts';
import { ToastrService } from '@gauzy/ui-core/core';
import { DocumentsService } from '../../services/documents.service';
import { randomIdToken } from '../../services/local-id.util';
import { DOCS_DEFAULT_MAX_FILE_SIZE_BYTES, DOCS_UPLOAD_ACCEPT } from '../../docs.constants';
import * as i0 from "@angular/core";
const ALLOWED_EXTENSIONS = new Set(DOCS_UPLOAD_ACCEPT.split(',').map((extension) => extension.trim().toLowerCase()));
/**
 * Editor image/file upload pipeline (spec 05 §6.6):
 * intercept → validate → placeholder insert (blob preview / attachment card
 * with transient `uploadId`) → `POST /documents/upload` (`source: EDITOR`,
 * `parentId` = the page id) → one-transaction placeholder→final swap.
 * Base64 never enters the doc; autosave skips while `hasPending`.
 */
export class EditorUploadService {
    constructor() {
        this.documentsService = inject(DocumentsService);
        this.toastrService = inject(ToastrService);
        this.translate = inject(TranslateService);
        this.zone = inject(NgZone);
        this.uploads = new Map();
        /** The still-open HTTP request behind each in-flight upload, keyed by `uploadId`. */
        this.requests = new Map();
        /**
         * Bumped by every `destroy()`. The editor this service dispatches into is torn
         * down and rebuilt whenever the `page/:id` route changes, so a response that
         * arrives afterwards belongs to a session whose `Editor` — and whose ProseMirror
         * view — no longer exists. Mirrors `DocumentAutosaveService`'s session guard.
         */
        this.session = 0;
        this._pendingCount$ = new BehaviorSubject(0);
        /** Number of in-flight or failed placeholders still in the doc. */
        this.pendingCount$ = this._pendingCount$.asObservable();
        /** The PAGE document uploads attach under (child FILE documents). */
        this.parentDocumentId = null;
        /** Org max file size — refreshed from settings by the page component. */
        this.maxFileSizeBytes = DOCS_DEFAULT_MAX_FILE_SIZE_BYTES;
    }
    get hasPending() {
        return this._pendingCount$.value > 0;
    }
    getUpload(uploadId) {
        return uploadId ? this.uploads.get(uploadId) : undefined;
    }
    /** FileHandler onDrop/onPaste + slash/file-picker entry point. */
    handleFiles(editor, files, pos) {
        for (const file of Array.from(files)) {
            if (!this.validate(file))
                continue;
            this.startUpload(editor, file, pos);
            pos = undefined; // subsequent files insert at the selection
        }
    }
    retry(editor, uploadId) {
        const upload = this.uploads.get(uploadId);
        if (!upload || upload.status !== 'error')
            return;
        upload.status = 'uploading';
        upload.progress = 0;
        this.emitPending();
        this.performUpload(editor, upload);
    }
    remove(editor, uploadId) {
        // The placeholder is about to leave the doc — a response for it would have
        // nothing left to swap, so stop paying for the transfer.
        this.cancelRequest(uploadId);
        const upload = this.uploads.get(uploadId);
        if (upload?.objectUrl)
            URL.revokeObjectURL(upload.objectUrl);
        this.uploads.delete(uploadId);
        this.emitPending();
        // Drop the placeholder node from the doc.
        const position = this.findByUploadId(editor, uploadId);
        if (position) {
            editor.view.dispatch(editor.view.state.tr.delete(position.pos, position.pos + position.node.nodeSize));
        }
    }
    /**
     * Tears the pipeline down for the editor being destroyed (component destroy, or a
     * `page/:id` rebuild). Revoking the object URLs is not enough on its own: an
     * un-cancelled request answers into `swap()`/`fail()`, which dispatch straight at
     * `editor.view` — by then a destroyed ProseMirror view belonging to another
     * document. Cancel first, then drop the placeholders.
     */
    destroy() {
        this.session += 1;
        this.requests.forEach((subscription) => subscription.unsubscribe());
        this.requests.clear();
        this.uploads.forEach((upload) => {
            if (upload.objectUrl)
                URL.revokeObjectURL(upload.objectUrl);
        });
        this.uploads.clear();
        this._pendingCount$.next(0);
    }
    /** Provided per `gz-document-editor`; Angular destroys it with the component. */
    ngOnDestroy() {
        this.destroy();
    }
    // ─── Internals ───────────────────────────────────────────────
    validate(file) {
        if (file.size > this.maxFileSizeBytes) {
            this.toastrService.danger(this.translate.instant('DOCS.UPLOAD.FILE_TOO_LARGE', {
                name: file.name,
                max: `${Math.round(this.maxFileSizeBytes / (1024 * 1024))} MB`
            }));
            return false;
        }
        const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        if (!ALLOWED_EXTENSIONS.has(extension)) {
            this.toastrService.danger(this.translate.instant('DOCS.UPLOAD.TYPE_NOT_ALLOWED', { name: file.name }));
            return false;
        }
        return true;
    }
    startUpload(editor, file, pos) {
        const uploadId = `upl_${Date.now()}_${randomIdToken(7)}`;
        const isImage = file.type.startsWith('image/');
        const upload = {
            uploadId,
            file,
            kind: isImage ? 'image' : 'file',
            status: 'uploading',
            progress: 0,
            objectUrl: isImage ? URL.createObjectURL(file) : undefined
        };
        this.uploads.set(uploadId, upload);
        this.emitPending();
        const content = isImage
            ? { type: 'image', attrs: { src: upload.objectUrl, alt: file.name, uploadId } }
            : {
                type: 'fileAttachment',
                attrs: { documentId: null, name: file.name, size: file.size, mimeType: file.type, uploadId }
            };
        const chain = editor.chain().focus();
        if (typeof pos === 'number')
            chain.insertContentAt(pos, content);
        else
            chain.insertContent(content);
        chain.run();
        this.performUpload(editor, upload);
    }
    performUpload(editor, upload) {
        // Captured at dispatch time so the terminal handlers can tell whether they still
        // belong to the live editor: `destroy()` bumps the session, and the page re-points
        // `parentDocumentId` the moment the route ':id' changes.
        const session = this.session;
        const parentDocumentId = this.parentDocumentId;
        // A retry re-issues the same `uploadId` — never leave its predecessor open.
        this.cancelRequest(upload.uploadId);
        const subscription = this.documentsService
            .upload(upload.file, {
            parentId: parentDocumentId ?? undefined,
            source: DocumentSourceEnum.EDITOR,
            importToKnowledge: false
        })
            .subscribe({
            next: (event) => {
                if (this.isStale(session, parentDocumentId))
                    return;
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    upload.progress = Math.round((event.loaded / event.total) * 100);
                }
                else if (event.type === HttpEventType.Response) {
                    const outcome = readUploadOutcome(event.body);
                    this.zone.run(() => {
                        // Re-checked inside the zone hop: the swap only runs if this is
                        // still the document the upload was started for.
                        if (this.isStale(session, parentDocumentId))
                            return;
                        if (outcome.document)
                            this.swap(editor, upload, outcome.document);
                        // A per-file rejection rides a 201, not an error response —
                        // the placeholder must still flip to its failed state.
                        else
                            this.fail(editor, upload, outcome.message);
                    });
                }
            },
            error: (error) => {
                this.requests.delete(upload.uploadId);
                if (this.isStale(session, parentDocumentId))
                    return;
                this.zone.run(() => this.fail(editor, upload, error?.error?.message));
            },
            complete: () => this.requests.delete(upload.uploadId)
        });
        // A synchronous observable is already closed here — tracking it would only
        // leave a dead entry behind for `destroy()` and `retry()` to trip over.
        if (!subscription.closed)
            this.requests.set(upload.uploadId, subscription);
    }
    /**
     * True once this upload's response can no longer be applied: the editor was torn
     * down (`destroy()` bumped the session), or the page moved to another document.
     */
    isStale(session, parentDocumentId) {
        return session !== this.session || parentDocumentId !== this.parentDocumentId;
    }
    cancelRequest(uploadId) {
        const subscription = this.requests.get(uploadId);
        if (!subscription)
            return;
        this.requests.delete(uploadId);
        subscription.unsubscribe();
    }
    /** Flips a placeholder to its retryable error state and re-renders its node view. */
    fail(editor, upload, message) {
        upload.status = 'error';
        upload.error = message ?? 'upload failed';
        this.emitPending();
        // Nudge node views to re-render their error state.
        editor.view.dispatch(editor.view.state.tr.setMeta('gzUploadStateChanged', upload.uploadId));
    }
    /** One transaction swaps placeholder attrs to the final child-FILE document (spec 05 §6.6 step 5). */
    swap(editor, upload, document) {
        const position = this.findByUploadId(editor, upload.uploadId);
        if (position) {
            const attrs = upload.kind === 'image'
                ? {
                    ...position.node.attrs,
                    uploadId: null,
                    documentId: String(document.id),
                    src: this.documentsService.rawUrl(document.id)
                }
                : {
                    ...position.node.attrs,
                    uploadId: null,
                    documentId: String(document.id),
                    name: document.name ?? upload.file.name,
                    size: document.fileSize ?? upload.file.size,
                    mimeType: document.mimeType ?? upload.file.type
                };
            editor.view.dispatch(editor.view.state.tr.setNodeMarkup(position.pos, undefined, attrs));
        }
        if (upload.objectUrl)
            URL.revokeObjectURL(upload.objectUrl);
        this.uploads.delete(upload.uploadId);
        this.emitPending();
    }
    findByUploadId(editor, uploadId) {
        let found = null;
        editor.state.doc.descendants((node, pos) => {
            if (found)
                return false;
            if (node.attrs?.['uploadId'] === uploadId) {
                found = { node, pos };
                return false;
            }
            return true;
        });
        return found;
    }
    emitPending() {
        this._pendingCount$.next(this.uploads.size);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditorUploadService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditorUploadService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EditorUploadService, decorators: [{
            type: Injectable
        }] });
/**
 * Reads the terminal response of a one-file editor upload.
 *
 * `POST /documents/upload` takes the multipart field **`files`** and answers **201 with the
 * batch envelope** `{ results: [{ document, duplicateOfId? }], rejected: [{ fileName, code,
 * message }] }` (`document-upload.controller.ts` → `IDocumentUploadResponse`) — a per-file
 * rejection (magic-byte mismatch, oversize, quota) rides that 201 and is *not* an HTTP error.
 * `DocumentsService.upload()` normalizes the one-file case back to a bare `IDocument` body
 * and re-throws a rejection as an `HttpErrorResponse`, so both shapes are read here: the
 * normalized document, and the raw envelope if this ever receives one directly.
 */
function readUploadOutcome(body) {
    const envelope = body;
    if (!envelope)
        return {};
    const accepted = envelope.results?.[0]?.document;
    if (accepted)
        return { document: accepted };
    const rejection = envelope.rejected?.[0];
    if (rejection)
        return { message: rejection.message ?? rejection.code };
    // Legacy single-document body.
    return envelope.id ? { document: envelope } : {};
}
/**
 * Persist-safe deep copy of the doc JSON (spec 05 §6.6): drops transient
 * `uploadId` attrs, removes `image` nodes whose `src` is still a blob/data URL
 * and `fileAttachment` placeholders without a `documentId`.
 */
export function sanitizeContentJson(json) {
    const clean = (node) => {
        if (!node || typeof node !== 'object')
            return node;
        const typed = node;
        if (typed.type === 'image') {
            const src = typed.attrs?.['src'];
            if (typeof src === 'string' && (src.startsWith('blob:') || src.startsWith('data:')))
                return null;
        }
        if (typed.type === 'fileAttachment' && !typed.attrs?.['documentId'])
            return null;
        const copy = { ...typed };
        if (typed.attrs && 'uploadId' in typed.attrs) {
            const { uploadId: _uploadId, ...rest } = typed.attrs;
            copy['attrs'] = rest;
        }
        if (Array.isArray(typed.content)) {
            copy['content'] = typed.content.map(clean).filter((child) => child !== null);
        }
        return copy;
    };
    return clean(json);
}
//# sourceMappingURL=editor-upload.service.js.map