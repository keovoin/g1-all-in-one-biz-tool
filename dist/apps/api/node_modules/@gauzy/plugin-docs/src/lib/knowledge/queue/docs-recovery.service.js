"use strict";
var DocsRecoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsRecoveryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const scheduler_1 = require("@gauzy/scheduler");
const docs_config_1 = require("../../docs.config");
const docs_constants_1 = require("../../docs.constants");
const type_orm_document_index_state_repository_1 = require("../../repositories/type-orm-document-index-state.repository");
const type_orm_document_repository_1 = require("../../repositories/type-orm-document.repository");
const docs_ai_service_1 = require("../ai/docs-ai.service");
const knowledge_constants_1 = require("../knowledge.constants");
const vector_store_registry_1 = require("../vector-store/vector-store.registry");
const constants_1 = require("./constants");
const docs_recovery_predicate_1 = require("./docs-recovery.predicate");
const docs_queue_service_1 = require("./docs-queue.service");
/** Upper bound of auto-reindex enqueues per drift sweep — the next run picks up the rest. */
const DRIFT_SWEEP_MAX_ENQUEUES = 200;
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
let DocsRecoveryService = DocsRecoveryService_1 = class DocsRecoveryService {
    constructor(typeOrmDocumentRepository, typeOrmDocumentIndexStateRepository, docsQueueService, docsAiService) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.typeOrmDocumentIndexStateRepository = typeOrmDocumentIndexStateRepository;
        this.docsQueueService = docsQueueService;
        this.docsAiService = docsAiService;
        this.logger = new common_1.Logger(DocsRecoveryService_1.name);
    }
    /**
     * Schedules the startup recovery scan — delayed (15 s settle), non-blocking. Called
     * from `DocsPlugin.onPluginBootstrap()`.
     */
    scheduleStartupScan() {
        this.startupTimer = setTimeout(() => {
            this.runScan('startup').catch((error) => {
                this.logger.error(`Startup recovery scan failed: ${error.message}`);
            });
        }, docs_constants_1.DOCS_RECOVERY_STARTUP_DELAY_MS);
        // Never keep the process alive for a recovery scan.
        if (typeof this.startupTimer?.unref === 'function') {
            this.startupTimer.unref();
        }
    }
    /**
     * Cancels the pending startup scan (plugin destroy).
     */
    cancelStartupScan() {
        if (this.startupTimer) {
            clearTimeout(this.startupTimer);
            this.startupTimer = undefined;
        }
    }
    /**
     * Every-10-minutes reconcile: enqueues the `docs.reconcile` job (deterministic job
     * id via the scheduler, so overlapping schedulers coalesce). The worker handler runs
     * `runScan('reconcile')`.
     */
    async enqueueReconcile() {
        const requestedAt = new Date().toISOString();
        this.logger.log(`Queue docs.reconcile sweep at ${requestedAt}`);
        return { requestedAt };
    }
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
    async runScan(mode) {
        const config = (0, docs_config_1.getDocsConfig)();
        const thresholds = {
            uploadedStaleMinutes: docs_constants_1.DOCS_RECOVERY_UPLOADED_STALE_MINUTES,
            stuckThresholdMinutes: config.stuckThresholdMinutes,
            failAfterHours: docs_constants_1.DOCS_RECOVERY_FAILED_AFTER_HOURS
        };
        const now = new Date();
        const staleBefore = new Date(now.getTime() - thresholds.uploadedStaleMinutes * 60_000);
        // One id suffix per sweep: duplicates INSIDE a scan still coalesce, while every new
        // scan gets ids BullMQ has never retained — see the class doc.
        const runId = now.getTime();
        // One bounded query: every row that could possibly need recovery.
        const candidates = await this.typeOrmDocumentRepository.find({
            where: [
                {
                    kind: contracts_1.DocumentKindEnum.FILE,
                    status: (0, typeorm_1.In)([contracts_1.DocumentStatusEnum.UPLOADED, contracts_1.DocumentStatusEnum.PROCESSING]),
                    updatedAt: (0, typeorm_1.LessThan)(staleBefore)
                },
                {
                    status: contracts_1.DocumentStatusEnum.READY,
                    knowledgeStatus: (0, typeorm_1.In)([contracts_1.DocumentKnowledgeStatusEnum.QUEUED, contracts_1.DocumentKnowledgeStatusEnum.INDEXING]),
                    updatedAt: (0, typeorm_1.LessThan)(staleBefore)
                }
            ],
            take: 500 // bounded sweep — the next run picks up the rest
        });
        const counters = { 'reenqueue-extract': 0, 'reenqueue-chunk': 0, 'mark-failed': 0, skipped: 0 };
        for (const document of candidates) {
            const action = (0, docs_recovery_predicate_1.classifyRecoveryAction)(document, now, thresholds);
            switch (action) {
                case 'reenqueue-extract': {
                    await this.docsQueueService.enqueue(constants_1.DOCS_JOB_EXTRACT, this.recoverySnapshot(document), {
                        jobId: this.recoveryJobId(constants_1.DOCS_JOB_EXTRACT, document.id, runId)
                    });
                    counters['reenqueue-extract']++;
                    break;
                }
                case 'reenqueue-chunk': {
                    await this.docsQueueService.enqueue(constants_1.DOCS_JOB_CHUNK, this.recoverySnapshot(document), {
                        jobId: this.recoveryJobId(constants_1.DOCS_JOB_CHUNK, document.id, runId)
                    });
                    counters['reenqueue-chunk']++;
                    break;
                }
                case 'mark-failed': {
                    await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, {
                        status: contracts_1.DocumentStatusEnum.FAILED,
                        statusMessage: 'Processing was interrupted and could not be recovered.',
                        reviewStatus: contracts_1.DocumentReviewStatusEnum.PENDING,
                        reviewReason: contracts_1.DocumentReviewReasonEnum.EXTRACTION_FAILED
                    });
                    counters['mark-failed']++;
                    break;
                }
                default:
                    counters.skipped++;
            }
        }
        this.logger.log(`Recovery scan (${mode}): candidates=${candidates.length}, extract=${counters['reenqueue-extract']}, ` +
            `chunk=${counters['reenqueue-chunk']}, failed=${counters['mark-failed']}`);
        // §8.4 — embedding-model drift detection rides the same sweep.
        try {
            counters['model-drift'] = await this.runModelDriftSweep();
        }
        catch (error) {
            this.logger.warn(`Model-drift sweep failed: ${error.message}`);
        }
        return counters;
    }
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
    async runModelDriftSweep() {
        const config = (0, docs_config_1.getDocsConfig)();
        // The deployment-wide expected model: the configured model when embeddings could
        // actually be produced right now (AI on + provider + vector-capable store), else
        // the lexical sentinel. (Tenant-BYOK divergence is handled per document by the
        // bulk-reindex endpoint, which resolves per tenant.)
        const store = await vector_store_registry_1.DocumentVectorStoreRegistry.resolve();
        const vectorCapable = Boolean(store && store.id !== knowledge_constants_1.VECTOR_STORE_LEXICAL);
        const expectedModel = config.aiEnabled && vectorCapable && this.docsAiService.embeddingProviderConfigured()
            ? config.embeddingModel
            : knowledge_constants_1.LEXICAL_ONLY_EMBEDDING_MODEL;
        const distinct = await this.typeOrmDocumentIndexStateRepository
            .createQueryBuilder('state')
            .select('state.embeddingModel', 'embeddingModel')
            .addSelect('COUNT(*)', 'count')
            .groupBy('state.embeddingModel')
            .getRawMany();
        const drifted = distinct.filter((row) => row.embeddingModel !== expectedModel);
        if (!drifted.length) {
            return 0;
        }
        const driftedTotal = drifted.reduce((sum, row) => sum + Number(row.count), 0);
        this.logger.warn(`Embedding-model drift: expected '${expectedModel}', found ` +
            drifted.map((row) => `'${row.embeddingModel}' (${row.count})`).join(', ') +
            ` — ${config.autoReindexOnModelChange ? 'auto re-index is ON' : 'run POST /knowledge/reindex to re-embed'}`);
        if (!config.autoReindexOnModelChange) {
            return driftedTotal;
        }
        // Bounded, low-priority re-enqueue of mismatched rows across tenants.
        const rows = await this.typeOrmDocumentIndexStateRepository
            .createQueryBuilder('state')
            .select(['state.documentId AS "documentId"', 'state.tenantId AS "tenantId"', 'state.organizationId AS "organizationId"'])
            .where('state.embeddingModel != :expectedModel', { expectedModel })
            .limit(DRIFT_SWEEP_MAX_ENQUEUES)
            .getRawMany();
        const runId = Date.now();
        for (const row of rows) {
            await this.docsQueueService.enqueue(constants_1.DOCS_JOB_CHUNK, {
                documentId: row.documentId,
                tenantId: row.tenantId,
                organizationId: row.organizationId,
                reason: 'model-changed'
            }, { jobId: this.recoveryJobId(constants_1.DOCS_JOB_CHUNK, row.documentId, runId), priority: 10 });
        }
        this.logger.log(`Model-drift auto re-index enqueued ${rows.length}/${driftedTotal} documents`);
        return driftedTotal;
    }
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
    recoveryJobId(jobName, documentId, runId) {
        return `${this.docsQueueService.jobIdFor(jobName, documentId)}:${runId}`;
    }
    /**
     * Builds the recovery job snapshot for one row (system-initiated — no user id).
     */
    recoverySnapshot(document) {
        return {
            documentId: document.id,
            tenantId: document.tenantId,
            organizationId: document.organizationId,
            reason: 'recovery'
        };
    }
};
exports.DocsRecoveryService = DocsRecoveryService;
tslib_1.__decorate([
    (0, scheduler_1.ScheduledJob)({
        name: 'docs-reconcile-schedule',
        cron: '*/10 * * * *', // every 10 minutes
        queueName: constants_1.DOCS_PROCESSING_QUEUE,
        queueJobName: constants_1.DOCS_JOB_RECONCILE,
        preventOverlap: true
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DocsRecoveryService.prototype, "enqueueReconcile", null);
exports.DocsRecoveryService = DocsRecoveryService = DocsRecoveryService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        type_orm_document_index_state_repository_1.TypeOrmDocumentIndexStateRepository,
        docs_queue_service_1.DocsQueueService,
        docs_ai_service_1.DocsAiService])
], DocsRecoveryService);
//# sourceMappingURL=docs-recovery.service.js.map