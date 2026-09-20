"use strict";
var DocsProcessingWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsProcessingWorker = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const scheduler_1 = require("@gauzy/scheduler");
const docs_config_1 = require("../../docs.config");
const docs_constants_1 = require("../../docs.constants");
const constants_1 = require("./constants");
const docs_pipeline_service_1 = require("./docs-pipeline.service");
const docs_pipeline_types_1 = require("./docs-pipeline.types");
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
let DocsProcessingWorker = DocsProcessingWorker_1 = class DocsProcessingWorker extends scheduler_1.QueueWorkerHost {
    constructor(pipeline) {
        super();
        this.pipeline = pipeline;
        this.logger = new common_1.Logger(DocsProcessingWorker_1.name);
        /**
         * How many AI-heavy stages each tenant currently holds on THIS worker process.
         *
         * Deliberately per-process and in-memory: it is a fairness valve on the provider calls this
         * process makes, not a distributed lock, and the entry is deleted the moment the count
         * reaches zero so the map cannot grow with the tenant table.
         */
        this.aiInFlightByTenant = new Map();
    }
    /** `docs.extract` → {@link DocsPipelineService.handleExtract}. */
    async handleExtract(job) {
        await this.pipeline.handleExtract((0, docs_pipeline_types_1.fromBullJob)(job));
    }
    /**
     * `docs.classify` → {@link DocsPipelineService.handleClassify}, serialized per tenant.
     *
     * @param job The stage job.
     * @param token The BullMQ lock token — required to hand the job back to the delayed set.
     */
    async handleClassify(job, token) {
        await this.serializedPerTenant(job, token, () => this.pipeline.handleClassify((0, docs_pipeline_types_1.fromBullJob)(job)));
    }
    /** `docs.chunk` → {@link DocsPipelineService.handleChunk}. */
    async handleChunk(job) {
        await this.pipeline.handleChunk((0, docs_pipeline_types_1.fromBullJob)(job));
    }
    /**
     * `docs.embed` → {@link DocsPipelineService.handleEmbed}, serialized per tenant.
     *
     * @param job The stage job.
     * @param token The BullMQ lock token — required to hand the job back to the delayed set.
     */
    async handleEmbed(job, token) {
        await this.serializedPerTenant(job, token, () => this.pipeline.handleEmbed((0, docs_pipeline_types_1.fromBullJob)(job)));
    }
    /** `docs.index` → {@link DocsPipelineService.handleIndex}. */
    async handleIndex(job) {
        await this.pipeline.handleIndex((0, docs_pipeline_types_1.fromBullJob)(job));
    }
    /**
     * `docs.thumbnail` → {@link DocsPipelineService.handleThumbnail}.
     *
     * The one handler here that cannot reject: the stage swallows its own failures, so BullMQ
     * never retries a cosmetic job and never records one as failed.
     */
    async handleThumbnail(job) {
        await this.pipeline.handleThumbnail((0, docs_pipeline_types_1.fromBullJob)(job));
    }
    /** `docs.reconcile` → {@link DocsPipelineService.handleReconcile}. */
    async handleReconcile(job) {
        await this.pipeline.handleReconcile((0, docs_pipeline_types_1.fromBullJob)(job));
    }
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
    async serializedPerTenant(job, token, run) {
        const tenantId = job?.data?.tenantId;
        // Nothing to serialize on (no tenant snapshot), or no lock token to hand the job back
        // with — `moveToDelayed` would throw and lose the stage. Run it rather than drop it.
        if (!tenantId || !token) {
            await run();
            return;
        }
        const inFlight = this.aiInFlightByTenant.get(tenantId) ?? 0;
        if (inFlight >= docs_constants_1.DOCS_TENANT_AI_CONCURRENCY) {
            this.logger.log(`${job.name} deferred for document ${job.data?.documentId} — tenant ${tenantId} already holds ` +
                `${inFlight}/${docs_constants_1.DOCS_TENANT_AI_CONCURRENCY} AI slot(s) on this worker; retrying in ` +
                `${docs_constants_1.DOCS_TENANT_BUSY_DEFER_DELAY_MS}ms.`);
            await job.moveToDelayed(Date.now() + docs_constants_1.DOCS_TENANT_BUSY_DEFER_DELAY_MS, token);
            // 🛑 BullMQ requires this exact signal: the job is already in the delayed set, so the
            // worker must neither complete nor fail it. Anything else double-handles the job.
            throw new bullmq_1.DelayedError(`${job.name} deferred — tenant ${tenantId} is at the per-tenant AI concurrency cap.`);
        }
        this.aiInFlightByTenant.set(tenantId, inFlight + 1);
        try {
            await run();
        }
        finally {
            const remaining = (this.aiInFlightByTenant.get(tenantId) ?? 1) - 1;
            if (remaining > 0) {
                this.aiInFlightByTenant.set(tenantId, remaining);
            }
            else {
                this.aiInFlightByTenant.delete(tenantId);
            }
        }
    }
};
exports.DocsProcessingWorker = DocsProcessingWorker;
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(constants_1.DOCS_JOB_EXTRACT),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], DocsProcessingWorker.prototype, "handleExtract", null);
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(constants_1.DOCS_JOB_CLASSIFY),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocsProcessingWorker.prototype, "handleClassify", null);
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(constants_1.DOCS_JOB_CHUNK),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], DocsProcessingWorker.prototype, "handleChunk", null);
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(constants_1.DOCS_JOB_EMBED),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job, String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocsProcessingWorker.prototype, "handleEmbed", null);
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(constants_1.DOCS_JOB_INDEX),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], DocsProcessingWorker.prototype, "handleIndex", null);
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(constants_1.DOCS_JOB_THUMBNAIL),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], DocsProcessingWorker.prototype, "handleThumbnail", null);
tslib_1.__decorate([
    (0, scheduler_1.QueueJobHandler)(constants_1.DOCS_JOB_RECONCILE),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bullmq_1.Job]),
    tslib_1.__metadata("design:returntype", Promise)
], DocsProcessingWorker.prototype, "handleReconcile", null);
exports.DocsProcessingWorker = DocsProcessingWorker = DocsProcessingWorker_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, scheduler_1.QueueWorker)(constants_1.DOCS_PROCESSING_QUEUE, {
        concurrency: (0, docs_config_1.getDocsConfig)().queueConcurrency
    }),
    tslib_1.__metadata("design:paramtypes", [docs_pipeline_service_1.DocsPipelineService])
], DocsProcessingWorker);
//# sourceMappingURL=docs-processing.worker.js.map