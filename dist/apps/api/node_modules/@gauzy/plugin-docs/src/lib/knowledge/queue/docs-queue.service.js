"use strict";
var DocsQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsQueueService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const scheduler_1 = require("@gauzy/scheduler");
const docs_constants_1 = require("../../docs.constants");
const constants_1 = require("./constants");
const docs_pipeline_types_1 = require("./docs-pipeline.types");
/**
 * The single dispatch seam of the `docs-processing` pipeline. Two modes:
 *
 * **QUEUED** — a `@gauzy/scheduler` root with queueing exists in this process, so
 * `SchedulerQueueService` resolves and every job goes to BullMQ with the standard retry policy
 * (`attempts: 3`, exponential backoff from a 120 s base, `removeOnComplete: 500` /
 * `removeOnFail: 1000`) and a deterministic job id `docs:<stage>:<documentId>` — duplicate
 * enqueues (double-click, retry races, a recovery scan overlapping a live job) coalesce in
 * Redis instead of running twice.
 *
 * **INLINE** — no scheduler root (the API never imports `SchedulerModule.forRoot`, and the
 * standalone worker app never loads the plugin list), so `SchedulerQueueService` is absent.
 * The stage is then dispatched **directly to `DocsPipelineService`**, the same handler the
 * BullMQ worker host calls, on a background task so the HTTP request is not blocked. Without
 * this the pipeline would simply never run: uploads would sit in `UPLOADED` forever.
 *
 * Inline mode trades the queue's guarantees for an in-process approximation:
 * - **coalescing** — an in-flight guard keyed on `docs:<stage>:<documentId>` so a duplicate
 *   trigger cannot run the same stage twice concurrently (Redis job-id coalescing has no
 *   in-process equivalent, and there is no retained-completed set to consult);
 * - **retries** — a single immediate attempt (`DOCS_INLINE_JOB_ATTEMPTS`), after which the
 *   failure dead-letters onto the document row (`FAILED` + `statusMessage`), never an
 *   unhandled rejection. The startup/reconcile recovery scan re-drives stale rows.
 *
 * The DB row is the source of truth in both modes.
 */
let DocsQueueService = DocsQueueService_1 = class DocsQueueService {
    constructor(moduleRef, schedulerQueueService) {
        this.moduleRef = moduleRef;
        this.schedulerQueueService = schedulerQueueService;
        this.logger = new common_1.Logger(DocsQueueService_1.name);
        /**
         * Deterministic stage keys (`docs:<stage>:<documentId>`) currently executing inline —
         * the in-process stand-in for BullMQ's job-id coalescing.
         */
        this.inFlight = new Set();
        /** Guard so a queue→inline degradation is reported once, not once per job. */
        this.degradationReported = false;
    }
    /**
     * Announces the active dispatch mode once, at startup, so an operator can tell from the
     * logs whether pipeline work is going to Redis or running in-process.
     */
    onModuleInit() {
        if (this.schedulerQueueService) {
            this.logger.log(`docs-processing dispatch mode: QUEUED — jobs go to the BullMQ queue "${constants_1.DOCS_PROCESSING_QUEUE}" ` +
                `(attempts=${docs_constants_1.DOCS_JOB_ATTEMPTS}, exponential backoff from ${docs_constants_1.DOCS_JOB_BACKOFF_DELAY_MS}ms).`);
        }
        else {
            this.logger.log('docs-processing dispatch mode: INLINE — no @gauzy/scheduler root in this process, so pipeline ' +
                'stages run in-process on a background task (single attempt per stage, failures dead-letter ' +
                'onto the document row). Import SchedulerModule.forRoot() to use the BullMQ queue instead.');
        }
    }
    /** True when this process dispatches through BullMQ rather than running stages in-process. */
    get isQueued() {
        return Boolean(this.schedulerQueueService);
    }
    /**
     * Dispatches one pipeline stage — to the queue when one is available, in-process otherwise.
     *
     * @param jobName A `DOCS_JOB_*` constant (e.g. `docs.extract`).
     * @param payload The job payload carrying the tenant/organization snapshot.
     * @param options Optional BullMQ option overrides (e.g. `priority` for sweeps, or an
     *                explicit run-unique `jobId` that must bypass coalescing).
     * @returns True when the stage was accepted (enqueued, dispatched inline, or coalesced).
     */
    async enqueue(jobName, payload, options = {}) {
        // An explicit `options.jobId` wins — deliberate re-run sites (reprocess, reindex,
        // recovery sweeps) pass a run-unique id precisely to bypass coalescing.
        const jobId = options.jobId ?? this.jobIdFor(jobName, payload.documentId);
        if (!this.schedulerQueueService) {
            return this.dispatchInline(jobName, payload, jobId, Number(options.delay) || 0);
        }
        // Built first: the id is optional, and inlining the conditional would nest template literals.
        const correlationSuffix = payload.correlationId ? `, correlationId ${payload.correlationId}` : '';
        try {
            await this.schedulerQueueService.enqueue({
                queueName: constants_1.DOCS_PROCESSING_QUEUE,
                jobName,
                data: payload,
                options: {
                    jobId,
                    attempts: docs_constants_1.DOCS_JOB_ATTEMPTS,
                    backoff: { type: 'exponential', delay: docs_constants_1.DOCS_JOB_BACKOFF_DELAY_MS },
                    removeOnComplete: docs_constants_1.DOCS_JOB_REMOVE_ON_COMPLETE,
                    removeOnFail: docs_constants_1.DOCS_JOB_REMOVE_ON_FAIL,
                    ...this.priorityFor(payload),
                    ...options
                }
            });
            this.logger.log(`Enqueued ${jobName} for document ${payload.documentId} (tenant ${payload.tenantId}, ` +
                `reason ${payload.reason}${correlationSuffix})`);
            return true;
        }
        catch (error) {
            // The scheduler throws here when queueing is disabled or the queue is not registered.
            // Rather than dropping the stage on the floor (the old behaviour, which relied on a
            // recovery scan that may itself never be enqueued), degrade to the inline runner.
            this.logger.error(`Failed to enqueue ${jobName} for document ${payload.documentId}: ${error.message}`);
            if (!this.degradationReported) {
                this.degradationReported = true;
                this.logger.warn('docs-processing dispatch mode: degrading to INLINE — the configured queue rejected an enqueue.');
            }
            return this.dispatchInline(jobName, payload, jobId, Number(options.delay) || 0);
        }
    }
    /**
     * Default queue priority for a payload (`07-ai-knowledge.md` §3.1/§15).
     *
     * A bulk import (`reason: 'import'`) is background work by definition: it must never overtake
     * an interactive upload, a page save or an explicit re-index — the fairness half that the
     * worker's per-tenant in-flight cap cannot provide, because ordering is decided in Redis
     * before any worker sees the job. Every other reason keeps BullMQ's default (unprioritized,
     * served first), and an explicit `options.priority` from the caller still wins.
     *
     * @param payload The job payload.
     * @returns `{ priority }` for bulk-import work, an empty object otherwise.
     */
    priorityFor(payload) {
        return payload?.reason === 'import' ? { priority: docs_constants_1.DOCS_BULK_IMPORT_JOB_PRIORITY } : {};
    }
    /**
     * Builds the deterministic BullMQ job id for a pipeline stage + document.
     * (`docs:<stage>:<documentId>` — an already-enqueued stage is skipped.)
     */
    jobIdFor(jobName, documentId) {
        const stage = jobName.startsWith('docs.') ? jobName.slice('docs.'.length) : jobName;
        return `docs:${stage}:${documentId}`;
    }
    /**
     * Schedules an inline stage run on a background task.
     *
     * Deliberately fire-and-forget: the caller is usually an HTTP request handler (upload,
     * reprocess, reindex) which must return as soon as the work is accepted, exactly as it
     * does when the job goes to Redis.
     *
     * `delayMs` is the inline stand-in for BullMQ's `delay` option — without it, a caller that
     * parks a stage (the `FEATURE_DOCUMENTS` gate re-queuing itself) would re-dispatch on the
     * very next tick and spin. The timer is `unref`'d so a parked stage never holds the process
     * open, and the in-flight guard stays claimed for the whole wait so the parked stage cannot
     * pile up behind itself.
     *
     * @returns True — accepted. (A coalesced duplicate is also "accepted": the stage is
     *          already running for that document.)
     */
    dispatchInline(jobName, payload, jobId, delayMs = 0) {
        // `docs.reconcile` carries no document; key the guard on the stage alone.
        const key = payload?.documentId ? this.jobIdFor(jobName, payload.documentId) : jobName;
        if (this.inFlight.has(key)) {
            this.logger.log(`Inline ${jobName} for document ${payload?.documentId ?? 'n/a'} is already running — duplicate trigger coalesced.`);
            return true;
        }
        this.inFlight.add(key);
        // Built first: both parts are optional, and inlining them would nest template literals.
        const correlationSuffix = payload?.correlationId ? `, correlationId ${payload.correlationId}` : '';
        const delaySuffix = delayMs > 0 ? `, delayed ${delayMs}ms` : '';
        this.logger.log(`Dispatching ${jobName} inline for document ${payload?.documentId ?? 'n/a'} ` +
            `(tenant ${payload?.tenantId}, reason ${payload?.reason}${correlationSuffix}${delaySuffix})`);
        // `setImmediate`/`setTimeout` (not `await`) so the request path returns straight away;
        // `void` marks the deliberate floating promise — `runInline` never rejects.
        const run = () => {
            void this.runInline(jobName, payload, jobId, key);
        };
        if (delayMs > 0) {
            setTimeout(run, delayMs).unref?.();
        }
        else {
            setImmediate(run);
        }
        return true;
    }
    /**
     * Runs one inline stage to completion and clears the in-flight guard. Never rejects.
     */
    async runInline(jobName, payload, jobId, key) {
        try {
            const runner = this.resolvePipelineRunner();
            if (!runner) {
                this.logger.error(`Inline ${jobName} for document ${payload?.documentId} could not run — the docs pipeline runner ` +
                    `is not registered (expected provider token "${docs_pipeline_types_1.DOCS_PIPELINE_RUNNER}").`);
                return;
            }
            // `runStageSafely` owns the failure path (dead-letter onto the document row).
            await runner.runStageSafely(jobName, (0, docs_pipeline_types_1.inlineStageJob)(jobId, payload));
        }
        catch (error) {
            // Belt and braces — `runStageSafely` swallows stage errors, so this can only be a
            // resolution failure. An unhandled rejection here would take the process down.
            this.logger.error(`Inline ${jobName} failed for document ${payload?.documentId}: ${error.message}`);
        }
        finally {
            this.inFlight.delete(key);
        }
    }
    /**
     * Resolves the pipeline runner lazily through `ModuleRef`.
     *
     * It cannot be a constructor dependency: `DocsPipelineService` injects THIS service to
     * chain the next stage, so the two would form a DI cycle (and a CommonJS require cycle
     * that can null out `design:paramtypes`). The token indirection keeps the class out of
     * this module's import graph entirely.
     */
    resolvePipelineRunner() {
        if (this.pipelineRunner !== undefined) {
            return this.pipelineRunner;
        }
        try {
            this.pipelineRunner = this.moduleRef.get(docs_pipeline_types_1.DOCS_PIPELINE_RUNNER, { strict: false });
        }
        catch {
            this.pipelineRunner = null;
        }
        return this.pipelineRunner;
    }
};
exports.DocsQueueService = DocsQueueService;
exports.DocsQueueService = DocsQueueService = DocsQueueService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(1, (0, common_1.Optional)()),
    tslib_1.__metadata("design:paramtypes", [core_1.ModuleRef,
        scheduler_1.SchedulerQueueService])
], DocsQueueService);
//# sourceMappingURL=docs-queue.service.js.map