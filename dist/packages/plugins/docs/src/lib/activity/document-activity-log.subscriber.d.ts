import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ID } from '@gauzy/contracts';
import { ActivityLogService, EventBus } from '@gauzy/core';
import { DocumentEvent } from '../events/document.event';
/**
 * The compact projection stored as the activity entry's `data`.
 *
 * 🛑 Deliberately NOT the whole entity: a `Document` carries `contentJson`, `contentHtml`,
 * `contentBinary` and `extractedText`, which run to megabytes and are exactly the columns every
 * other read path in this plugin refuses to project. Copying them into a jsonb activity row per
 * transition would bloat the table without telling a reader anything a timeline needs.
 */
export interface IDocumentActivitySnapshot {
    id: ID;
    kind: string;
    name: string;
    parentId: ID | null;
    status: string;
    knowledgeStatus: string;
    reviewStatus: string;
    visibility: string;
    source: string;
    isArchived: boolean;
    version: number;
}
/**
 * Activity-log writer for the Documents hub (`00-product-spec.md` R-COL-03).
 *
 * Every mutation and every pipeline/knowledge/review transition already publishes a
 * `DocumentEvent` on the core RxJS event bus (`DocumentService.emitDocumentEvent` /
 * `DocumentProcessingService.emitEvent`). Rather than sprinkling `logActivity` calls across
 * ~20 handlers — where the next one added would inevitably forget it — this subscriber sits on
 * that one seam and turns each event into an `ActivityLog` row through the platform's own
 * `ActivityLogService`. The detail panel's timeline reads those rows back with
 * `entity: 'Document', entityId: <id>`.
 *
 * **Attribution.** `context.actor` wins when the emitter states it (every pipeline-owned
 * transition sets `'system'`), otherwise it is inferred from the request identity. The
 * explicit marker is load-bearing: in inline dispatch mode the pipeline runs on a
 * `setImmediate` **inside the uploader's async context**, so inference alone would credit the
 * extractor's status writes to whoever uploaded the file.
 *
 * **Best-effort by contract.** `logActivity` publishes on the CQRS bus and the row is written by
 * the core handler; anything that throws on this path is logged and swallowed, because an
 * activity row must never roll back the mutation that produced it.
 */
export declare class DocumentActivityLogSubscriber implements OnModuleInit, OnModuleDestroy {
    private readonly eventBus;
    private readonly activityLogService;
    private readonly logger;
    private subscription?;
    constructor(eventBus: EventBus, activityLogService: ActivityLogService);
    /** Whether the event-bus subscription is live. */
    get isActive(): boolean;
    /**
     * Subscribes to every `DocumentEvent` on the core event bus.
     */
    onModuleInit(): void;
    /** Drops the subscription on teardown. */
    onModuleDestroy(): void;
    /**
     * Writes one activity entry for a document event.
     *
     * @param event The published document event.
     */
    record(event: DocumentEvent): void;
    /**
     * Resolves the actor of a transition: the emitter's explicit marker first, then the request
     * identity (present on a request thread, absent on a queue thread).
     *
     * @param context The lifecycle-phase context of the event.
     * @returns `User` or `System`.
     */
    private resolveActor;
    /**
     * Reads the current user id, tolerating a thread with no request context at all.
     */
    private currentUserId;
    /**
     * Turns the event's `previous`/`next` pair into the before/after maps
     * `ActivityLogService.logActivity` diffs into `updatedFields` + `previousValues` +
     * `updatedValues`. A transition that names no field (a plain metadata save) yields
     * `undefined` for both, and the entry records the action alone.
     *
     * @param context The lifecycle-phase context of the event.
     * @returns The before/after maps, or `{}` when the event carries no transition.
     */
    private transitionValues;
    /**
     * Projects the document onto the compact snapshot stored as the entry's `data`.
     */
    private snapshotOf;
}
