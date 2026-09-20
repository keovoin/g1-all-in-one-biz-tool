"use strict";
var DocumentActivityLogSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentActivityLogSubscriber = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const document_event_1 = require("../events/document.event");
/**
 * The `ActionTypeEnum` each `BaseEntityEventType` maps onto.
 */
const ACTION_BY_EVENT_TYPE = {
    created: contracts_1.ActionTypeEnum.Created,
    updated: contracts_1.ActionTypeEnum.Updated,
    deleted: contracts_1.ActionTypeEnum.Deleted
};
/**
 * The document column each lifecycle phase transitions. `crud` has none by default — a move or
 * an archive names its own through `IDocumentEventContext.field`.
 */
const FIELD_BY_PHASE = {
    crud: undefined,
    status: 'status',
    knowledge: 'knowledgeStatus',
    review: 'reviewStatus'
};
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
let DocumentActivityLogSubscriber = DocumentActivityLogSubscriber_1 = class DocumentActivityLogSubscriber {
    constructor(eventBus, activityLogService) {
        this.eventBus = eventBus;
        this.activityLogService = activityLogService;
        this.logger = new common_1.Logger(DocumentActivityLogSubscriber_1.name);
    }
    /** Whether the event-bus subscription is live. */
    get isActive() {
        return !!this.subscription;
    }
    /**
     * Subscribes to every `DocumentEvent` on the core event bus.
     */
    onModuleInit() {
        try {
            this.subscription = this.eventBus.ofType(document_event_1.DocumentEvent).subscribe({
                next: (event) => this.record(event),
                error: (error) => this.logger.warn(`Document activity-log stream error: ${error?.message}`)
            });
            this.logger.log('Documents activity log active — subscribed to DocumentEvent.');
        }
        catch (error) {
            this.logger.warn(`Failed to subscribe to DocumentEvent: ${error.message}`);
        }
    }
    /** Drops the subscription on teardown. */
    onModuleDestroy() {
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }
    /**
     * Writes one activity entry for a document event.
     *
     * @param event The published document event.
     */
    record(event) {
        try {
            const document = event?.entity;
            // Tenant + organization are the activity row's own scope columns, so an event that
            // cannot supply both has nothing to write against.
            if (!document?.id || !document.tenantId || !document.organizationId) {
                return;
            }
            const context = event.context ?? { phase: 'crud' };
            const action = ACTION_BY_EVENT_TYPE[event.type] ?? contracts_1.ActionTypeEnum.Updated;
            const { originalValues, newValues } = this.transitionValues(context);
            this.activityLogService.logActivity(contracts_1.BaseEntityEnum.Document, action, this.resolveActor(context), document.id, document.name ?? '', this.snapshotOf(document), document.organizationId, document.tenantId, originalValues, newValues);
        }
        catch (error) {
            this.logger.warn(`Failed to write the document activity log entry: ${error.message}`);
        }
    }
    /**
     * Resolves the actor of a transition: the emitter's explicit marker first, then the request
     * identity (present on a request thread, absent on a queue thread).
     *
     * @param context The lifecycle-phase context of the event.
     * @returns `User` or `System`.
     */
    resolveActor(context) {
        if (context.actor === 'system') {
            return contracts_1.ActorTypeEnum.System;
        }
        if (context.actor === 'user') {
            return contracts_1.ActorTypeEnum.User;
        }
        return this.currentUserId() ? contracts_1.ActorTypeEnum.User : contracts_1.ActorTypeEnum.System;
    }
    /**
     * Reads the current user id, tolerating a thread with no request context at all.
     */
    currentUserId() {
        try {
            return core_1.RequestContext.currentUserId() ?? undefined;
        }
        catch {
            return undefined; // queue threads have no request context
        }
    }
    /**
     * Turns the event's `previous`/`next` pair into the before/after maps
     * `ActivityLogService.logActivity` diffs into `updatedFields` + `previousValues` +
     * `updatedValues`. A transition that names no field (a plain metadata save) yields
     * `undefined` for both, and the entry records the action alone.
     *
     * @param context The lifecycle-phase context of the event.
     * @returns The before/after maps, or `{}` when the event carries no transition.
     */
    transitionValues(context) {
        const field = context.field ?? FIELD_BY_PHASE[context.phase];
        if (!field || context.previous === undefined || context.next === undefined) {
            return {};
        }
        return {
            originalValues: { [field]: context.previous },
            newValues: { [field]: context.next }
        };
    }
    /**
     * Projects the document onto the compact snapshot stored as the entry's `data`.
     */
    snapshotOf(document) {
        return {
            id: document.id,
            kind: document.kind,
            name: document.name,
            parentId: document.parentId ?? null,
            status: document.status,
            knowledgeStatus: document.knowledgeStatus,
            reviewStatus: document.reviewStatus,
            visibility: document.visibility,
            source: document.source,
            isArchived: document.isArchived === true,
            version: document.version ?? 1
        };
    }
};
exports.DocumentActivityLogSubscriber = DocumentActivityLogSubscriber;
exports.DocumentActivityLogSubscriber = DocumentActivityLogSubscriber = DocumentActivityLogSubscriber_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.EventBus, core_1.ActivityLogService])
], DocumentActivityLogSubscriber);
//# sourceMappingURL=document-activity-log.subscriber.js.map