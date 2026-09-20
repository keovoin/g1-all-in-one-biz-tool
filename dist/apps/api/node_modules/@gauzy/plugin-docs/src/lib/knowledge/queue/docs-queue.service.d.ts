import { OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JobsOptions } from 'bullmq';
import { SchedulerQueueService } from '@gauzy/scheduler';
import { IDocsJobBase } from './docs-job.types';
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
export declare class DocsQueueService implements OnModuleInit {
    private readonly moduleRef;
    private readonly schedulerQueueService?;
    private readonly logger;
    /**
     * Deterministic stage keys (`docs:<stage>:<documentId>`) currently executing inline —
     * the in-process stand-in for BullMQ's job-id coalescing.
     */
    private readonly inFlight;
    /** Lazily resolved inline dispatch target; `null` once resolution has failed. */
    private pipelineRunner?;
    /** Guard so a queue→inline degradation is reported once, not once per job. */
    private degradationReported;
    constructor(moduleRef: ModuleRef, schedulerQueueService?: SchedulerQueueService);
    /**
     * Announces the active dispatch mode once, at startup, so an operator can tell from the
     * logs whether pipeline work is going to Redis or running in-process.
     */
    onModuleInit(): void;
    /** True when this process dispatches through BullMQ rather than running stages in-process. */
    get isQueued(): boolean;
    /**
     * Dispatches one pipeline stage — to the queue when one is available, in-process otherwise.
     *
     * @param jobName A `DOCS_JOB_*` constant (e.g. `docs.extract`).
     * @param payload The job payload carrying the tenant/organization snapshot.
     * @param options Optional BullMQ option overrides (e.g. `priority` for sweeps, or an
     *                explicit run-unique `jobId` that must bypass coalescing).
     * @returns True when the stage was accepted (enqueued, dispatched inline, or coalesced).
     */
    enqueue<T extends IDocsJobBase>(jobName: string, payload: T, options?: JobsOptions): Promise<boolean>;
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
    private priorityFor;
    /**
     * Builds the deterministic BullMQ job id for a pipeline stage + document.
     * (`docs:<stage>:<documentId>` — an already-enqueued stage is skipped.)
     */
    jobIdFor(jobName: string, documentId: string): string;
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
    private dispatchInline;
    /**
     * Runs one inline stage to completion and clears the in-flight guard. Never rejects.
     */
    private runInline;
    /**
     * Resolves the pipeline runner lazily through `ModuleRef`.
     *
     * It cannot be a constructor dependency: `DocsPipelineService` injects THIS service to
     * chain the next stage, so the two would form a DI cycle (and a CommonJS require cycle
     * that can null out `design:paramtypes`). The token indirection keeps the class out of
     * this module's import graph entirely.
     */
    private resolvePipelineRunner;
}
