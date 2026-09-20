import { OnDestroy } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { Observable } from 'rxjs';
import { ID, IDocument } from '@gauzy/contracts';
import { DocumentsQuery } from '../+state/documents.query';
import { IDocumentUploadOptions } from '../models/docs-api.model';
import { DocumentsService } from './documents.service';
import * as i0 from "@angular/core";
export type UploadQueueItemState = 'uploading' | 'done' | 'error';
export interface UploadQueueItem {
    /** Stable client-side id for template tracking / retry / dismiss. */
    key: string;
    file: File;
    options: IDocumentUploadOptions;
    progress: number;
    state: UploadQueueItemState;
    documentId?: ID;
    error?: string;
    /**
     * Advisory in-organization sha256 match reported by the upload response
     * (`R-UPL-04`). The upload is never blocked or dropped — this only drives the
     * "possible duplicate of X" notice on the progress row and in the detail panel.
     *
     * 🛑 It exists **only** on the upload envelope, never as a column on the
     * document, so this queue is the single place that remembers it.
     */
    duplicateOfId?: ID;
    /** Name of `duplicateOfId`, resolved lazily; absent when the lookup failed. */
    duplicateOfName?: string;
    /** Files in the enqueue batch this item belonged to (§7.3 single-upload toast). */
    batchSize: number;
}
/** What the detail panel needs to render the dedup notice for a document. */
export interface UploadDuplicateNotice {
    id: ID;
    name?: string;
}
export interface UploadValidationError {
    file: File;
    reason: 'too-large' | 'type-not-allowed';
}
/**
 * Why the *server* rejected an upload. `quota-exceeded` is the P1 org storage
 * quota (`08-permissions-security.md` §5.7) — it needs its own friendly toast
 * because, unlike the others, no amount of retrying will fix it and the raw
 * message ("Payload too large") points the user at the wrong problem.
 */
export type UploadRejectionReason = 'quota-exceeded' | 'too-large' | 'type-not-allowed' | 'failed';
export interface UploadRejection {
    file: File;
    reason: UploadRejectionReason;
    /** Server message, when it carried actionable detail (current usage / limit). */
    message?: string;
}
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
export declare class UploadQueueService implements OnDestroy {
    private readonly documentsService;
    private readonly documentsQuery;
    private readonly actions;
    private readonly _items$;
    readonly items$: Observable<UploadQueueItem[]>;
    /** Emits each document that reaches READY (facet refresh; future chat hooks). */
    private readonly _documentReady$;
    readonly documentReady$: Observable<IDocument>;
    /**
     * Emits each document whose processing settles, REGARDLESS of outcome —
     * `documentReady$` is the READY-only subset. The stats tiles hang off this
     * one: a document that settles FAILED moves the Failed count exactly as much
     * as a READY one moves Ready.
     */
    private readonly _documentSettled$;
    readonly documentSettled$: Observable<IDocument>;
    /** Client-side validation failures from the last `enqueue` call. */
    private readonly _validationErrors$;
    readonly validationErrors$: Observable<UploadValidationError[]>;
    /** Server-side upload rejections (quota, size, type) — one emission per file. */
    private readonly _rejections$;
    readonly rejections$: Observable<UploadRejection>;
    /** Uploaded document ids whose processing has not settled yet. */
    private readonly pendingIds;
    /** documentId → consecutive failed status fetches (see `recordPollFailure`). */
    private readonly pollFailures;
    private pollSubscription;
    private processingVisible;
    private readonly processingSubscription;
    /** upload key → in-flight request (unsubscribed on dismiss / destroy). */
    private readonly uploadSubscriptions;
    private keySeq;
    maxFileSizeBytes: number;
    maxFilesPerUpload: number;
    private readonly allowedExtensions;
    constructor(documentsService: DocumentsService, documentsQuery: DocumentsQuery, actions: Actions);
    ngOnDestroy(): void;
    /**
     * Validates and enqueues files. Returns `false` when the whole batch is
     * rejected (> max files). Oversize/disallowed files become error rows.
     */
    enqueue(files: File[], options: IDocumentUploadOptions): boolean;
    retry(key: string): void;
    dismiss(key: string): void;
    clearFinished(): void;
    private validate;
    private startUpload;
    /**
     * Resolves the duplicate's display name. Cosmetic and fault-isolated: a failed
     * lookup (deleted, or not visible to this user) leaves the notice generic
     * rather than printing a raw id — the upload itself is unaffected either way.
     */
    private resolveDuplicateName;
    /**
     * The dedup notice for an uploaded document (`R-UPL-04`), or `null` when this
     * session did not upload it — `duplicateOfId` is upload-response-only, so a
     * document opened on a later page load simply has no notice to show.
     */
    duplicateNoticeFor(documentId: ID | null | undefined): UploadDuplicateNotice | null;
    /**
     * True when the document arrived through a batch of exactly one file — the
     * condition §7.3 puts on the "uploaded, needs review" toast (a ten-file drop
     * must not raise ten toasts).
     */
    isSingleFileUpload(documentId: ID | null | undefined): boolean;
    /**
     * Maps an upload error response onto a reason the UI can speak to.
     *
     * Quota detection is deliberately belt-and-braces: `03-backend-plugin.md` §6
     * lists the stable `DOCS_*` codes but quota is P1 and its code is not in that
     * list yet, so both the expected code names and a 413/409 whose message
     * mentions quota are accepted. A missed quota rejection would otherwise show
     * "file too large" for a file that is well under the per-file limit.
     */
    private classifyRejection;
    private ensurePolling;
    private tick;
    /** Drops a pending id and its failure counter. */
    private forgetPending;
    /**
     * Counts a failed status fetch and gives up on the id once
     * `DOCS_POLL_MAX_FAILURES` consecutive attempts have failed. The queue row is
     * marked errored so the user sees *something* rather than a spinner that
     * never resolves.
     */
    private recordPollFailure;
    private markFailedItems;
    private isSettled;
    private stopPollingIfSettled;
    private find;
    private upsert;
    private patch;
    static ɵfac: i0.ɵɵFactoryDeclaration<UploadQueueService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UploadQueueService>;
}
