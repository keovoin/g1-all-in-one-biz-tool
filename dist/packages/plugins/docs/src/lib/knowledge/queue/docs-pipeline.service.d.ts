import { DocsFeatureService } from '../../services/docs-feature.service';
import { DocumentProcessingService } from '../../services/document-processing.service';
import { DocumentClassifierService } from '../classification/document-classifier.service';
import { DocumentIndexService } from '../indexing/document-index.service';
import { DocumentThumbnailService } from '../thumbnail/document-thumbnail.service';
import { IDocsChunkJob, IDocsClassifyJob, IDocsEmbedJob, IDocsExtractJob, IDocsIndexJob, IDocsReconcileJob, IDocsThumbnailJob } from './docs-job.types';
import { IDocsPipelineRunner, IDocsStageJob } from './docs-pipeline.types';
import { DocsRecoveryService } from './docs-recovery.service';
import { DocsQueueService } from './docs-queue.service';
/**
 * The `docs-processing` pipeline itself — the full M3 chain
 * `extract → classify → chunk → embed → index` (plus the `reconcile` sweep).
 *
 * **This is the ONE definition of every stage.** Two dispatchers drive it:
 *
 * - `DocsProcessingWorker` — the BullMQ worker host, when a `@gauzy/scheduler` root with
 *   queueing exists in the process (today: `apps/worker`).
 * - `DocsQueueService` inline mode — when it does not (today: `apps/api`, which never imports
 *   `SchedulerModule.forRoot`). Stages then run in-process, in the background.
 *
 * Handlers take {@link IDocsStageJob}, not a BullMQ `Job`, which is exactly what lets both
 * dispatchers share this code. Everything else is unchanged from the queue-only design:
 * handlers chain the graph explicitly with a per-run idempotency suffix derived from the
 * current job id, so BullMQ retries of a stage reuse the chained ids while distinct runs get
 * fresh ones.
 *
 * AI-disabled / no-provider deployments run the lexical-only path per the degradation ladder:
 * classify no-ops, embed skips, and index records the lexical-only marker — the document
 * still reaches `INDEXED`. Nothing is ever stuck waiting on AI availability.
 *
 * Every handler re-loads the document from the explicit tenant/organization snapshot on the
 * payload; a soft-deleted or missing row logs and completes (no retry). `RequestContext` is
 * NEVER consulted here — neither queue threads nor background inline runs have one.
 */
export declare class DocsPipelineService implements IDocsPipelineRunner {
    private readonly processingService;
    private readonly docsQueueService;
    private readonly recoveryService;
    private readonly classifierService;
    private readonly documentIndexService;
    private readonly thumbnailService;
    private readonly docsFeatureService;
    private readonly logger;
    constructor(processingService: DocumentProcessingService, docsQueueService: DocsQueueService, recoveryService: DocsRecoveryService, classifierService: DocumentClassifierService, documentIndexService: DocumentIndexService, thumbnailService: DocumentThumbnailService, docsFeatureService: DocsFeatureService);
    /**
     * The single dispatch table: stage name → handler.
     *
     * Rejections propagate — the BullMQ path needs them to drive its retry/backoff policy.
     * Inline callers use {@link runStageSafely} instead.
     *
     * Every document-bearing stage passes the `FEATURE_DOCUMENTS` gate first: with the feature
     * off for the job's tenant the stage is parked (re-queued with a delay), not processed.
     *
     * @param jobName A `DOCS_JOB_*` constant.
     * @param job The stage job (BullMQ-backed or synthetic).
     */
    runStage(jobName: string, job: IDocsStageJob): Promise<void>;
    /**
     * Inline entry point — runs one stage and **never rejects**.
     *
     * Inline runs are fire-and-forget background promises, so an escaping error would be an
     * unhandled rejection (and, worse, would leave the row stuck in `PROCESSING`/`INDEXING`).
     * Anything the stage's own error policy did not already dead-letter is dead-lettered here,
     * through the very same `markExtractionFailed` / `markKnowledgeFailed` path the queue
     * handlers use.
     *
     * @param jobName A `DOCS_JOB_*` constant.
     * @param job The synthetic single-attempt stage job.
     */
    runStageSafely(jobName: string, job: IDocsStageJob): Promise<void>;
    /**
     * `docs.extract` — load blob, run the extraction registry, write `extractedText`,
     * set `READY`, then chain classification.
     */
    handleExtract(job: IDocsStageJob<IDocsExtractJob>): Promise<void>;
    /**
     * `docs.classify` — LLM classification (§5). Best-effort by spec: every outcome
     * (classified, low-confidence, unusable, provider failure, AI disabled) continues the
     * chain; the document is already `READY` after extract.
     */
    handleClassify(job: IDocsStageJob<IDocsClassifyJob>): Promise<void>;
    /**
     * `docs.chunk` — heading-aware ~512/64-token windows with locator metadata,
     * transactional chunk replace, and the `contentHash` skip-if-unchanged short-circuit.
     */
    handleChunk(job: IDocsStageJob<IDocsChunkJob>): Promise<void>;
    /**
     * `docs.embed` — provider-resolved batched `embedMany` written through the vector
     * store as batches return; lexical-only conditions skip with `embeddingModel: null`.
     */
    handleEmbed(job: IDocsStageJob<IDocsEmbedJob>): Promise<void>;
    /**
     * `docs.index` — completeness verification, `document_index_state` upsert, and the
     * `INDEXED` flip (lexical-only runs record the sentinel model + metadata marker).
     */
    handleIndex(job: IDocsStageJob<IDocsIndexJob>): Promise<void>;
    /**
     * `docs.thumbnail` — grid preview for images and the first page of PDFs (§4.4).
     *
     * 🛑 **It cannot fail a document.** The service already swallows its own errors, and this
     * handler swallows anything left (a snapshot load that blew up, say), because the stage
     * runs *after* the document is `READY`: letting a resize error reach the stage-error
     * policy would dead-letter a perfectly good upload over a missing 320px image. There is
     * no retry worth the risk here — the next reprocess regenerates it.
     */
    handleThumbnail(job: IDocsStageJob<IDocsThumbnailJob>): Promise<void>;
    /**
     * `docs.reconcile` — the every-10-minutes recovery + model-drift sweep (also enqueued
     * at startup).
     */
    handleReconcile(job: IDocsStageJob<IDocsReconcileJob>): Promise<void>;
    /**
     * The `FEATURE_DOCUMENTS` gate of the pipeline.
     *
     * The REST layer refuses every route with `FeatureFlagGuard` the moment an admin turns the
     * feature off, but jobs enqueued while it was on keep flowing — and the reconcile sweep keeps
     * re-driving stale rows. So a stage whose tenant has the feature disabled is **parked**: the
     * exact same job is re-queued `DOCS_FEATURE_DISABLED_PARK_DELAY_MS` later (run-unique id, so
     * a retained completed job cannot swallow it) and the handler returns without touching the
     * document. Nothing is dropped and nothing is dead-lettered, so re-enabling the feature
     * resumes every parked document by itself.
     *
     * `docs.reconcile` is exempt — it carries no document and no tenant snapshot, and its own
     * per-document enqueues go through this gate anyway.
     *
     * @param jobName A `DOCS_JOB_*` constant.
     * @param job The stage job.
     * @returns True when the stage was parked and must not run.
     */
    private parkWhileFeatureDisabled;
    /**
     * True when the document participates in the AI knowledge system at all — i.e. its
     * `knowledgeStatus` is neither `NONE` nor `EXCLUDED`.
     *
     * This, and not `=== QUEUED`, is the gate that opens the knowledge chain after extract
     * and classify: a reprocess/re-import of an already-`INDEXED` (or `INDEXING`/`FAILED`)
     * document re-extracts its text, and gating on `QUEUED` would leave the index holding
     * the superseded extraction forever. `docs.chunk` still short-circuits on an unchanged
     * `contentHash`, so a no-op reprocess costs nothing.
     */
    private isInKnowledgeSystem;
    /**
     * A document excluded/reset while its knowledge chain was in flight aborts the chain
     * silently (skipping is not an error).
     */
    private knowledgeChainAborted;
    /**
     * Enqueues the next stage with a per-run idempotency suffix: BullMQ retries of the
     * CURRENT job reuse the same chained id (duplicates coalesce), while distinct runs
     * (forced reindex, re-import) get fresh ids and are never swallowed by a retained
     * completed job. Inline mode has no retained set, but keeping the same id derivation
     * means the two modes chain identically.
     */
    private enqueueChained;
    /**
     * Enqueues `docs.thumbnail` after a successful extract — best-effort in every sense.
     *
     * Two guards, both deliberate:
     * - formats that cannot produce a thumbnail (docx, csv, txt, html, xlsx, and every PAGE)
     *   are never enqueued at all, so the queue carries no work that would immediately no-op;
     * - the enqueue itself is wrapped, because it is the ONE part of this stage that runs on
     *   the extract job's error budget. An unavailable queue must not turn a successfully
     *   extracted document into a `FAILED` one.
     *
     * `force` is derived from the run reason: bytes that changed (`replace`) or an explicit
     * redo (`reindex`) regenerate; everything else honors the existing `thumbKey`.
     */
    private enqueueThumbnail;
    /**
     * Carries the tenant/organization snapshot (and reason/initiator) forward to the
     * next stage of the chain.
     */
    private baseOf;
    /**
     * ` (correlationId <id>)` for a stage's outcome/failure log line — the worker-side half of the
     * `DocsQueueService` "Enqueued ..." line, so a failure on a queue thread can be tied back to the
     * request that started the run. `''` when the payload carries none (a system-initiated run, or a
     * job enqueued before the field existed), leaving those lines exactly as they were. Reads ONLY
     * `correlationId` — no other payload content reaches a log through here.
     */
    private correlationTag;
    /**
     * Loads the document from the job snapshot; a missing/soft-deleted row logs and
     * completes the job (returns null — no retry).
     */
    private loadOrComplete;
    /**
     * Shared stage-error policy: transient errors rethrow (BullMQ retries with the
     * 120 s-base exponential backoff); permanent errors dead-letter onto the document
     * row and discard the job (no useless retries). The final transient attempt also
     * dead-letters so the row never sticks in `PROCESSING`/`INDEXING`.
     *
     * Inline runs carry `attempts: 1`, so every attempt is the final one: the row is
     * dead-lettered immediately instead of being retried (see `DOCS_INLINE_JOB_ATTEMPTS`).
     */
    private handleStageError;
    /**
     * Last-resort dead-letter for an inline run: routes anything the stage's own error
     * policy did not already catch through the standard failure path, so the row never
     * sticks in `PROCESSING`/`INDEXING` and the operator sees a `statusMessage`.
     *
     * `extract`/`classify` failures belong to the extraction side (`status: FAILED`);
     * `chunk`/`embed`/`index` failures are projection-only (`knowledgeStatus: FAILED`,
     * the document itself stays fine). `reconcile` carries no document — it only logs.
     */
    private deadLetter;
}
