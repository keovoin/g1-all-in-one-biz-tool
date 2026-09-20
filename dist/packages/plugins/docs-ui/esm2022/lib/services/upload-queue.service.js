import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { BehaviorSubject, catchError, of, Subject, timer } from 'rxjs';
import { DocumentKnowledgeStatusEnum, DocumentStatusEnum } from '@gauzy/contracts';
import { DocumentsActions } from '../+state/documents.actions';
import { DocumentsQuery } from '../+state/documents.query';
import { DOCS_DEFAULT_MAX_FILE_SIZE_BYTES, DOCS_MAX_FILES_PER_UPLOAD, DOCS_PROCESSING_POLL_MS, DOCS_UPLOAD_ACCEPT } from '../docs.constants';
import { DocumentsService } from './documents.service';
import * as i0 from "@angular/core";
import * as i1 from "./documents.service";
import * as i2 from "../+state/documents.query";
import * as i3 from "@ngneat/effects-ng";
/**
 * Consecutive failed status fetches after which a pending id is abandoned.
 * At `DOCS_PROCESSING_POLL_MS` that is a bounded ~30s of retrying, not forever.
 */
const DOCS_POLL_MAX_FAILURES = 6;
/**
 * Multi-file upload queue + processing poll.
 *
 * `enqueue` validates client-side (count/size/extension — UX only, the server
 * re-validates), then issues one multipart request per file with progress
 * events. A `timer(5000, 5000)` runs only while processing rows are visible or
 * the queue holds unsettled ids; each tick dispatches `pollTick` (silent
 * in-place refresh, never a URL write) and stops itself when everything
 * settles.
 */
export class UploadQueueService {
    constructor(documentsService, documentsQuery, actions) {
        this.documentsService = documentsService;
        this.documentsQuery = documentsQuery;
        this.actions = actions;
        this._items$ = new BehaviorSubject([]);
        this.items$ = this._items$.asObservable();
        /** Emits each document that reaches READY (facet refresh; future chat hooks). */
        this._documentReady$ = new Subject();
        this.documentReady$ = this._documentReady$.asObservable();
        /**
         * Emits each document whose processing settles, REGARDLESS of outcome —
         * `documentReady$` is the READY-only subset. The stats tiles hang off this
         * one: a document that settles FAILED moves the Failed count exactly as much
         * as a READY one moves Ready.
         */
        this._documentSettled$ = new Subject();
        this.documentSettled$ = this._documentSettled$.asObservable();
        /** Client-side validation failures from the last `enqueue` call. */
        this._validationErrors$ = new Subject();
        this.validationErrors$ = this._validationErrors$.asObservable();
        /** Server-side upload rejections (quota, size, type) — one emission per file. */
        this._rejections$ = new Subject();
        this.rejections$ = this._rejections$.asObservable();
        /** Uploaded document ids whose processing has not settled yet. */
        this.pendingIds = new Set();
        /** documentId → consecutive failed status fetches (see `recordPollFailure`). */
        this.pollFailures = new Map();
        this.pollSubscription = null;
        this.processingVisible = false;
        /** upload key → in-flight request (unsubscribed on dismiss / destroy). */
        this.uploadSubscriptions = new Map();
        this.keySeq = 0;
        this.maxFileSizeBytes = DOCS_DEFAULT_MAX_FILE_SIZE_BYTES;
        this.maxFilesPerUpload = DOCS_MAX_FILES_PER_UPLOAD;
        this.allowedExtensions = new Set(DOCS_UPLOAD_ACCEPT.split(',').map((extension) => extension.trim().toLowerCase()));
        // Pull org limits once (cosmetic; falls back to defaults).
        this.documentsService
            .getSettings()
            .pipe(catchError(() => of(null)))
            .subscribe((settings) => {
            if (settings?.capabilities?.maxFileSize)
                this.maxFileSizeBytes = settings.capabilities.maxFileSize;
        });
        // The poll also runs while any visible row is processing (e.g. after a Reprocess).
        this.processingSubscription = this.documentsQuery.isProcessingVisible$.subscribe((visible) => {
            this.processingVisible = visible;
            visible ? this.ensurePolling() : this.stopPollingIfSettled();
        });
    }
    ngOnDestroy() {
        this.pollSubscription?.unsubscribe();
        this.processingSubscription?.unsubscribe();
        this.uploadSubscriptions.forEach((subscription) => subscription.unsubscribe());
    }
    // ─── Queue API ───────────────────────────────────────────────
    /**
     * Validates and enqueues files. Returns `false` when the whole batch is
     * rejected (> max files). Oversize/disallowed files become error rows.
     */
    enqueue(files, options) {
        if (!files.length)
            return false;
        if (files.length > this.maxFilesPerUpload) {
            return false;
        }
        const errors = [];
        const batchSize = files.length;
        for (const file of files) {
            const key = `upload-${++this.keySeq}`;
            const validation = this.validate(file);
            if (validation) {
                errors.push(validation);
                this.upsert({
                    key,
                    file,
                    options,
                    progress: 0,
                    state: 'error',
                    error: validation.reason,
                    batchSize
                });
                continue;
            }
            this.upsert({ key, file, options, progress: 0, state: 'uploading', batchSize });
            this.startUpload(key, file, options);
        }
        if (errors.length)
            this._validationErrors$.next(errors);
        return true;
    }
    retry(key) {
        const item = this.find(key);
        if (!item || item.state !== 'error')
            return;
        if (item.documentId) {
            // Processing failed after upload — reprocess server-side.
            this.documentsService
                .reprocess(item.documentId)
                .pipe(catchError(() => of(null)))
                .subscribe((document) => {
                if (document) {
                    this.pendingIds.add(String(document.id));
                    this.upsert({ ...item, state: 'uploading', progress: 100 });
                    this.ensurePolling();
                }
            });
            return;
        }
        const validation = this.validate(item.file);
        if (validation)
            return; // still invalid client-side
        this.upsert({ ...item, state: 'uploading', progress: 0, error: undefined });
        this.startUpload(key, item.file, item.options);
    }
    dismiss(key) {
        this.uploadSubscriptions.get(key)?.unsubscribe();
        this.uploadSubscriptions.delete(key);
        this._items$.next(this._items$.value.filter((item) => item.key !== key));
    }
    clearFinished() {
        this._items$.next(this._items$.value.filter((item) => item.state === 'uploading'));
    }
    // ─── Internals ───────────────────────────────────────────────
    validate(file) {
        if (file.size > this.maxFileSizeBytes)
            return { file, reason: 'too-large' };
        const extension = `.${(file.name.split('.').pop() ?? '').toLowerCase()}`;
        if (!this.allowedExtensions.has(extension))
            return { file, reason: 'type-not-allowed' };
        return null;
    }
    startUpload(key, file, options) {
        const subscription = this.documentsService.uploadOne(file, options).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    this.patch(key, { progress: Math.round((event.loaded / event.total) * 100) });
                }
                else if (event.type === HttpEventType.Response) {
                    // `DocumentsService.uploadOne()` has already unwrapped the batch
                    // `{ results, rejected }` envelope down to this file's result; a
                    // per-file rejection arrives on the error channel below, never here
                    // with an empty body.
                    const result = event.body;
                    const document = result?.document;
                    const settled = this.isSettled(document);
                    this.patch(key, {
                        state: 'done',
                        progress: 100,
                        documentId: document?.id,
                        duplicateOfId: result?.duplicateOfId
                    });
                    if (result?.duplicateOfId)
                        this.resolveDuplicateName(key, result.duplicateOfId);
                    if (document && !settled) {
                        this.pendingIds.add(String(document.id));
                        this.ensurePolling();
                    }
                    // Refresh the list so the new row appears.
                    this.actions.dispatch(DocumentsActions.loadDocuments({ silent: true }));
                }
            },
            error: (error) => {
                const rejection = this.classifyRejection(file, error);
                this.patch(key, { state: 'error', error: error?.error?.message ?? rejection.reason });
                this._rejections$.next(rejection);
            }
        });
        this.uploadSubscriptions.set(key, subscription);
    }
    /**
     * Resolves the duplicate's display name. Cosmetic and fault-isolated: a failed
     * lookup (deleted, or not visible to this user) leaves the notice generic
     * rather than printing a raw id — the upload itself is unaffected either way.
     */
    resolveDuplicateName(key, duplicateOfId) {
        this.documentsService
            .getById(duplicateOfId)
            .pipe(catchError(() => of(null)))
            .subscribe((duplicate) => {
            if (duplicate?.name)
                this.patch(key, { duplicateOfName: duplicate.name });
        });
    }
    /**
     * The dedup notice for an uploaded document (`R-UPL-04`), or `null` when this
     * session did not upload it — `duplicateOfId` is upload-response-only, so a
     * document opened on a later page load simply has no notice to show.
     */
    duplicateNoticeFor(documentId) {
        if (!documentId)
            return null;
        const item = this._items$.value.find((entry) => String(entry.documentId) === String(documentId));
        if (!item?.duplicateOfId)
            return null;
        return { id: item.duplicateOfId, name: item.duplicateOfName };
    }
    /**
     * True when the document arrived through a batch of exactly one file — the
     * condition §7.3 puts on the "uploaded, needs review" toast (a ten-file drop
     * must not raise ten toasts).
     */
    isSingleFileUpload(documentId) {
        if (!documentId)
            return false;
        const item = this._items$.value.find((entry) => String(entry.documentId) === String(documentId));
        return item?.batchSize === 1;
    }
    /**
     * Maps an upload error response onto a reason the UI can speak to.
     *
     * Quota detection is deliberately belt-and-braces: `03-backend-plugin.md` §6
     * lists the stable `DOCS_*` codes but quota is P1 and its code is not in that
     * list yet, so both the expected code names and a 413/409 whose message
     * mentions quota are accepted. A missed quota rejection would otherwise show
     * "file too large" for a file that is well under the per-file limit.
     */
    classifyRejection(file, error) {
        const response = error;
        const code = response?.error?.code;
        const message = response?.error?.message;
        const mentionsQuota = /quota/i.test(String(message ?? ''));
        if (code === 'DOCS_QUOTA_EXCEEDED' || code === 'DOCS_ORG_QUOTA_EXCEEDED' || mentionsQuota) {
            return { file, reason: 'quota-exceeded', message };
        }
        if (code === 'DOCS_FILE_TOO_LARGE' || response?.status === 413) {
            return { file, reason: 'too-large', message };
        }
        if (code === 'DOCS_FILE_TYPE_REJECTED') {
            return { file, reason: 'type-not-allowed', message };
        }
        return { file, reason: 'failed', message };
    }
    ensurePolling() {
        if (this.pollSubscription)
            return;
        this.pollSubscription = timer(DOCS_PROCESSING_POLL_MS, DOCS_PROCESSING_POLL_MS).subscribe(() => this.tick());
    }
    tick() {
        const ids = [...this.pendingIds];
        // Silent page refresh; never writes the URL.
        this.actions.dispatch(DocumentsActions.pollTick(ids));
        // Off-page pending ids are fetched individually to detect settle.
        for (const id of ids) {
            this.documentsService
                .getById(id, ['categories', 'tags'])
                .pipe(catchError(() => of(null)))
                .subscribe((document) => {
                if (!document) {
                    // 🛑 Terminal path. An id whose fetch keeps failing (deleted row,
                    // revoked visibility, a persistent 5xx) used to stay pending
                    // forever, and the 5s timer with it — a background request every
                    // 5 seconds for the life of the page. Give up after a bounded
                    // number of consecutive failures.
                    this.recordPollFailure(id);
                    return;
                }
                this.pollFailures.delete(String(id));
                this.actions.dispatch(DocumentsActions.rowChanged(document));
                if (this.isSettled(document)) {
                    this.forgetPending(document.id);
                    this._documentSettled$.next(document);
                    if (document.status === DocumentStatusEnum.READY) {
                        this._documentReady$.next(document);
                        // Classification may have assigned categories/tags — refresh facets once.
                        this.actions.dispatch(DocumentsActions.refreshFacets());
                    }
                    this.markFailedItems(document);
                    this.stopPollingIfSettled();
                }
            });
        }
        this.stopPollingIfSettled();
    }
    /** Drops a pending id and its failure counter. */
    forgetPending(id) {
        this.pendingIds.delete(String(id));
        this.pollFailures.delete(String(id));
    }
    /**
     * Counts a failed status fetch and gives up on the id once
     * `DOCS_POLL_MAX_FAILURES` consecutive attempts have failed. The queue row is
     * marked errored so the user sees *something* rather than a spinner that
     * never resolves.
     */
    recordPollFailure(id) {
        const key = String(id);
        const failures = (this.pollFailures.get(key) ?? 0) + 1;
        if (failures < DOCS_POLL_MAX_FAILURES) {
            this.pollFailures.set(key, failures);
            return;
        }
        this.forgetPending(id);
        const item = this._items$.value.find((entry) => String(entry.documentId) === key);
        if (item && item.state !== 'error') {
            this.patch(item.key, { state: 'error', error: 'status-unavailable' });
        }
        this.stopPollingIfSettled();
    }
    markFailedItems(document) {
        if (document.status !== DocumentStatusEnum.FAILED)
            return;
        const item = this._items$.value.find((entry) => String(entry.documentId) === String(document.id));
        if (item)
            this.patch(item.key, { state: 'error', error: document.statusMessage ?? 'processing-failed' });
    }
    isSettled(document) {
        if (!document)
            return true;
        const statusSettled = document.status !== DocumentStatusEnum.UPLOADED && document.status !== DocumentStatusEnum.PROCESSING;
        const knowledgeSettled = document.knowledgeStatus !== DocumentKnowledgeStatusEnum.QUEUED &&
            document.knowledgeStatus !== DocumentKnowledgeStatusEnum.INDEXING;
        return statusSettled && knowledgeSettled;
    }
    stopPollingIfSettled() {
        if (this.pendingIds.size === 0 && !this.processingVisible && this.pollSubscription) {
            this.pollSubscription.unsubscribe();
            this.pollSubscription = null;
        }
    }
    find(key) {
        return this._items$.value.find((item) => item.key === key);
    }
    upsert(item) {
        const items = this._items$.value;
        const index = items.findIndex((entry) => entry.key === item.key);
        if (index >= 0) {
            const next = [...items];
            next[index] = item;
            this._items$.next(next);
        }
        else {
            this._items$.next([...items, item]);
        }
    }
    patch(key, partial) {
        const item = this.find(key);
        if (item)
            this.upsert({ ...item, ...partial });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UploadQueueService, deps: [{ token: i1.DocumentsService }, { token: i2.DocumentsQuery }, { token: i3.Actions }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UploadQueueService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UploadQueueService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.DocumentsService }, { type: i2.DocumentsQuery }, { type: i3.Actions }] });
//# sourceMappingURL=upload-queue.service.js.map