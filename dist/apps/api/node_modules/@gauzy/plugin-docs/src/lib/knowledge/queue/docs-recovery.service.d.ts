import { TypeOrmDocumentIndexStateRepository } from '../../repositories/type-orm-document-index-state.repository';
import { TypeOrmDocumentRepository } from '../../repositories/type-orm-document.repository';
import { DocsAiService } from '../ai/docs-ai.service';
import { IDocsReconcileJob } from './docs-job.types';
import { DocsQueueService } from './docs-queue.service';
/**
 * Startup recovery + periodic reconcile for the `docs-processing` pipeline.
 *
 * The DB row is the source of truth; the queue is not. BullMQ persists jobs in Redis so
 * most restarts resume without the scan — the scan covers Redis data loss and rows saved
 * `PROCESSING` before a crash mid-handler. Re-enqueues carry `reason: 'recovery'` and a
 * **run-unique** job id (`docs:<stage>:<documentId>:<runId>`): the plain deterministic id
 * is silently DISCARDED by BullMQ while a job with that id still sits in the retained
 * completed set, which is exactly the state a stuck document is in — the safety net would
 * report success and do nothing. One `runId` per sweep still coalesces duplicates inside a
 * single scan, the same way the other deliberate re-run sites work (`reprocess`,
 * `reindexDocument`, `regenerateSummary`, the drift sweep below).
 */
export declare class DocsRecoveryService {
    private readonly typeOrmDocumentRepository;
    private readonly typeOrmDocumentIndexStateRepository;
    private readonly docsQueueService;
    private readonly docsAiService;
    private readonly logger;
    private startupTimer?;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, typeOrmDocumentIndexStateRepository: TypeOrmDocumentIndexStateRepository, docsQueueService: DocsQueueService, docsAiService: DocsAiService);
    /**
     * Schedules the startup recovery scan — delayed (15 s settle), non-blocking. Called
     * from `DocsPlugin.onPluginBootstrap()`.
     */
    scheduleStartupScan(): void;
    /**
     * Cancels the pending startup scan (plugin destroy).
     */
    cancelStartupScan(): void;
    /**
     * Every-10-minutes reconcile: enqueues the `docs.reconcile` job (deterministic job
     * id via the scheduler, so overlapping schedulers coalesce). The worker handler runs
     * `runScan('reconcile')`.
     */
    enqueueReconcile(): Promise<IDocsReconcileJob>;
    /**
     * Runs one recovery scan: re-enqueues stale `UPLOADED`/`PROCESSING` rows from
     * `docs.extract`, stale knowledge `QUEUED`/`INDEXING` rows from `docs.chunk`, and
     * flips rows stuck in `PROCESSING` beyond the fail-after window to `FAILED`.
     *
     * Read-only except for the enqueues and the fail-flip; plain repository queries with
     * explicit predicates (no request context on this path).
     *
     * @param mode Log label: `startup` or `reconcile`.
     * @returns Per-action counters (also used by tests).
     */
    runScan(mode: 'startup' | 'reconcile'): Promise<Record<string, number>>;
    /**
     * Embedding-model drift detection (§8.4): compares the deployment's expected embedding
     * model against `SELECT DISTINCT embeddingModel FROM document_index_state` and logs a
     * summary when they diverge. Auto re-index is OFF by default
     * (`GAUZY_DOCS_AUTO_REINDEX_ON_MODEL_CHANGE`) — a model flip on a large installation
     * is deliberate, budgeted work. When enabled, mismatched rows are re-enqueued from
     * `docs.chunk` at low priority (bounded per sweep; `reason: 'model-changed'`).
     *
     * @returns The number of drifted documents (enqueued or merely reported).
     */
    runModelDriftSweep(): Promise<number>;
    /**
     * Builds the run-unique BullMQ job id of a recovery re-enqueue.
     *
     * The plain `docs:<stage>:<documentId>` id is not usable here: a stuck document usually
     * still HAS that id retained in the completed set, and BullMQ drops an `add()` for an
     * existing id without an error — the enqueue would report success while nothing runs.
     *
     * @param jobName The `DOCS_JOB_*` stage constant.
     * @param documentId The document being recovered.
     * @param runId The per-sweep stamp shared by every enqueue of one scan.
     */
    private recoveryJobId;
    /**
     * Builds the recovery job snapshot for one row (system-initiated — no user id).
     */
    private recoverySnapshot;
}
