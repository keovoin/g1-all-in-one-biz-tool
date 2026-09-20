import { Job } from 'bullmq';
import { QueueWorkerHost } from '@gauzy/scheduler';
import { IDocsChunkJob, IDocsClassifyJob, IDocsEmbedJob, IDocsExtractJob, IDocsIndexJob, IDocsReconcileJob, IDocsThumbnailJob } from './docs-job.types';
import { DocsPipelineService } from './docs-pipeline.service';
/**
 * The `docs-processing` BullMQ worker host — the queue-mode **dispatcher** for the M3
 * pipeline `extract → classify → chunk → embed → index`.
 *
 * It owns no stage logic: every handler adapts the BullMQ `Job` to the transport-neutral
 * {@link import('./docs-pipeline.types').IDocsStageJob} and calls `DocsPipelineService`, the
 * single definition of each stage. The in-process fallback (`DocsQueueService` inline mode)
 * calls exactly the same methods, so the two dispatchers can never drift apart.
 *
 * Errors deliberately propagate out of these methods: BullMQ needs the rejection to apply the
 * `attempts: 3` / 120 s-base exponential backoff policy the pipeline's stage-error handler
 * relies on.
 *
 * This provider is only registered when the plugin's queue mode is enabled (see
 * `isDocsQueueEnabled()` in `docs.config.ts`) — registering a `@Processor` without a BullMQ
 * root would open a stray Redis worker connection in every API process.
 *
 * The two AI-heavy stages (`classify`, `embed`) additionally run through
 * {@link DocsProcessingWorker.serializedPerTenant} — see `07-ai-knowledge.md` §3.1/§15.
 */
export declare class DocsProcessingWorker extends QueueWorkerHost {
    private readonly pipeline;
    private readonly logger;
    /**
     * How many AI-heavy stages each tenant currently holds on THIS worker process.
     *
     * Deliberately per-process and in-memory: it is a fairness valve on the provider calls this
     * process makes, not a distributed lock, and the entry is deleted the moment the count
     * reaches zero so the map cannot grow with the tenant table.
     */
    private readonly aiInFlightByTenant;
    constructor(pipeline: DocsPipelineService);
    /** `docs.extract` → {@link DocsPipelineService.handleExtract}. */
    handleExtract(job: Job<IDocsExtractJob>): Promise<void>;
    /**
     * `docs.classify` → {@link DocsPipelineService.handleClassify}, serialized per tenant.
     *
     * @param job The stage job.
     * @param token The BullMQ lock token — required to hand the job back to the delayed set.
     */
    handleClassify(job: Job<IDocsClassifyJob>, token?: string): Promise<void>;
    /** `docs.chunk` → {@link DocsPipelineService.handleChunk}. */
    handleChunk(job: Job<IDocsChunkJob>): Promise<void>;
    /**
     * `docs.embed` → {@link DocsPipelineService.handleEmbed}, serialized per tenant.
     *
     * @param job The stage job.
     * @param token The BullMQ lock token — required to hand the job back to the delayed set.
     */
    handleEmbed(job: Job<IDocsEmbedJob>, token?: string): Promise<void>;
    /** `docs.index` → {@link DocsPipelineService.handleIndex}. */
    handleIndex(job: Job<IDocsIndexJob>): Promise<void>;
    /**
     * `docs.thumbnail` → {@link DocsPipelineService.handleThumbnail}.
     *
     * The one handler here that cannot reject: the stage swallows its own failures, so BullMQ
     * never retries a cosmetic job and never records one as failed.
     */
    handleThumbnail(job: Job<IDocsThumbnailJob>): Promise<void>;
    /** `docs.reconcile` → {@link DocsPipelineService.handleReconcile}. */
    handleReconcile(job: Job<IDocsReconcileJob>): Promise<void>;
    /**
     * Runs an AI-heavy stage under the per-tenant in-flight cap of `07-ai-knowledge.md` §3.1.
     *
     * `concurrency` is a process budget that knows nothing about who queued the work, and the
     * queue service's `inFlight` set is per-*document* dedupe, not fairness — so with neither of
     * these one tenant's bulk import owns every slot and every other tenant's classification and
     * embedding waits behind it (and behind its share of the shared provider rate limit).
     *
     * A tenant already at {@link DOCS_TENANT_AI_CONCURRENCY} does **not** block the worker and is
     * **never** failed or dropped: the job is moved back to the delayed set
     * ({@link DOCS_TENANT_BUSY_DEFER_DELAY_MS} later) and `DelayedError` tells BullMQ the handler
     * has already re-homed it — no attempt is consumed, the lock is released, and the freed slot
     * goes to whoever is next. Combined with the lower `priority` the queue service puts on
     * `reason: 'import'` jobs, a 500-file import sinks below interactive work instead of starving it.
     *
     * @param job The stage job.
     * @param token The BullMQ lock token, as handed to the handler by `QueueWorkerHost.process`.
     * @param run The stage body to run while the slot is held.
     */
    private serializedPerTenant;
}
