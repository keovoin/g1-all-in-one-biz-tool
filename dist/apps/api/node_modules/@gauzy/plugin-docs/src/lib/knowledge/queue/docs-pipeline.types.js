"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_INLINE_JOB_ATTEMPTS = exports.DOCS_PIPELINE_RUNNER = void 0;
exports.fromBullJob = fromBullJob;
exports.inlineStageJob = inlineStageJob;
/**
 * Injection token of the inline pipeline runner.
 *
 * `DocsQueueService` resolves the runner through this token **lazily** (`ModuleRef`) instead
 * of importing `DocsPipelineService` directly: the pipeline injects the queue service (to
 * chain the next stage), so a constructor-level dependency in the other direction would be a
 * DI cycle — and even a plain `import` of the class would be a CommonJS require cycle that
 * can null out `design:paramtypes` metadata depending on module load order.
 */
exports.DOCS_PIPELINE_RUNNER = 'DOCS_PIPELINE_RUNNER';
/**
 * How many attempts an INLINE stage run gets.
 *
 * Deliberately **1**: inline mode has no Redis to hold a delayed retry, so a 120 s-base
 * exponential backoff would mean parking a live promise (and its DB handles) for minutes
 * inside the API process. One immediate attempt, then the failure dead-letters onto the
 * document row (`FAILED` + `statusMessage`) exactly like the queue's final attempt does —
 * and the recovery scan (`DocsRecoveryService`, which also runs in an API process via
 * `DocsPlugin.onPluginBootstrap`) re-drives stale rows later.
 */
exports.DOCS_INLINE_JOB_ATTEMPTS = 1;
/**
 * Adapts a BullMQ job to the stage-job surface.
 *
 * @param job The BullMQ job handed to a `@QueueJobHandler` method.
 * @returns The stage-job view of it (retry policy and `discard()` preserved).
 */
function fromBullJob(job) {
    return {
        id: job.id,
        data: job.data,
        attempts: job.opts?.attempts ?? 1,
        attemptsMade: job.attemptsMade ?? 0,
        discard: () => job.discard()
    };
}
/**
 * Builds the synthetic stage job of an INLINE run.
 *
 * @param jobId The id the enqueue site would have used — it seeds the chained-stage suffix,
 *              so a chain started from a run-unique id stays run-unique.
 * @param data The stage payload.
 * @returns A single-attempt stage job whose `discard()` is a no-op.
 */
function inlineStageJob(jobId, data) {
    return {
        id: jobId,
        data,
        attempts: exports.DOCS_INLINE_JOB_ATTEMPTS,
        attemptsMade: 0,
        discard: () => undefined
    };
}
//# sourceMappingURL=docs-pipeline.types.js.map