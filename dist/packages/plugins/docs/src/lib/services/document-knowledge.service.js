"use strict";
var DocumentKnowledgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentKnowledgeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
const docs_ai_service_1 = require("../knowledge/ai/docs-ai.service");
const document_index_service_1 = require("../knowledge/indexing/document-index.service");
const knowledge_constants_1 = require("../knowledge/knowledge.constants");
const constants_1 = require("../knowledge/queue/constants");
const docs_queue_service_1 = require("../knowledge/queue/docs-queue.service");
const vector_store_registry_1 = require("../knowledge/vector-store/vector-store.registry");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const document_processing_service_1 = require("./document-processing.service");
const document_service_1 = require("./document.service");
/**
 * Request-path knowledge lifecycle operations (§4.8 of the backend spec): import,
 * exclude, per-document and bulk re-index, and the capability status probe.
 */
let DocumentKnowledgeService = DocumentKnowledgeService_1 = class DocumentKnowledgeService {
    constructor(documentService, processingService, documentIndexService, docsQueueService, docsAiService, typeOrmDocumentRepository) {
        this.documentService = documentService;
        this.processingService = processingService;
        this.documentIndexService = documentIndexService;
        this.docsQueueService = docsQueueService;
        this.docsAiService = docsAiService;
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.logger = new common_1.Logger(DocumentKnowledgeService_1.name);
    }
    /**
     * `POST /documents/:id/knowledge/import` — `NONE`/`EXCLUDED`/`FAILED` → `QUEUED` +
     * enqueue from the right pipeline stage (`docs.chunk` when `extractedText` exists,
     * else `docs.extract`). Already `INDEXED`/`QUEUED`/`INDEXING` → no-op. FILE must be
     * `READY` (409 `DOCS_NOT_READY`); PAGE always eligible; FOLDER never indexable.
     */
    async importToKnowledge(id) {
        const document = await this.documentService.findOneScoped(id);
        this.assertIndexable(document);
        if ([
            contracts_1.DocumentKnowledgeStatusEnum.INDEXED,
            contracts_1.DocumentKnowledgeStatusEnum.QUEUED,
            contracts_1.DocumentKnowledgeStatusEnum.INDEXING
        ].includes(document.knowledgeStatus)) {
            return document; // idempotent no-op
        }
        if (document.kind === contracts_1.DocumentKindEnum.FILE && document.status !== contracts_1.DocumentStatusEnum.READY) {
            throw new common_1.ConflictException({
                message: 'The document must finish processing before it can enter AI knowledge',
                code: docs_constants_1.DOCS_NOT_READY
            });
        }
        await this.setKnowledgeStatus(document, contracts_1.DocumentKnowledgeStatusEnum.QUEUED);
        const hasText = document.kind === contracts_1.DocumentKindEnum.PAGE || Boolean(document.extractedText);
        await this.docsQueueService.enqueue(hasText ? constants_1.DOCS_JOB_CHUNK : constants_1.DOCS_JOB_EXTRACT, this.processingService.snapshotOf(document, 'import'), { jobId: `docs:${hasText ? 'chunk' : 'extract'}:${document.id}:${Date.now()}` });
        return document;
    }
    /**
     * `POST /documents/:id/knowledge/exclude` — sets `EXCLUDED` and deletes the document's
     * chunks + index state transactionally (excluded content leaves the index physically).
     * Idempotent.
     */
    async excludeFromKnowledge(id) {
        const document = await this.documentService.findOneScoped(id);
        await this.documentIndexService.removeKnowledgeProjection({ tenantId: document.tenantId, organizationId: document.organizationId }, document.id);
        if (document.knowledgeStatus !== contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED) {
            await this.setKnowledgeStatus(document, contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED);
        }
        return document;
    }
    /**
     * `POST /documents/:id/knowledge/reindex` — re-runs `chunk → embed → index`.
     * `force: false` (default) keeps the `contentHash` short-circuit.
     */
    async reindexDocument(id, input = {}) {
        const document = await this.documentService.findOneScoped(id);
        this.assertIndexable(document);
        if (document.knowledgeStatus === contracts_1.DocumentKnowledgeStatusEnum.NONE ||
            document.knowledgeStatus === contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED) {
            // A reindex of a never-imported document is an import.
            return this.importToKnowledge(id);
        }
        await this.setKnowledgeStatus(document, contracts_1.DocumentKnowledgeStatusEnum.QUEUED);
        await this.docsQueueService.enqueue(constants_1.DOCS_JOB_CHUNK, { ...this.processingService.snapshotOf(document, 'reindex'), force: input.force === true }, 
        // A user-triggered reindex must always run — bypass deterministic-id coalescing.
        { jobId: `docs:chunk:${document.id}:${Date.now()}` });
        return document;
    }
    /**
     * `POST /knowledge/reindex` — the bulk model-drift / full re-index sweep (§8.4).
     * Selects the caller's tenant/org `INDEXED` documents whose index state mismatches the
     * expected model (or all, for `scope: 'all'`) and enqueues low-priority `chunk` jobs.
     */
    async bulkReindex(input = {}) {
        const tenantId = core_1.RequestContext.currentTenantId();
        // Same rule as every other docs path: an unresolvable organization scope is a 400, never
        // "the whole tenant" (a null used to be dropped from the where and enqueued reindex jobs for
        // every indexed document of the tenant with a null organization key).
        const organizationId = this.documentService.resolveOrganizationId();
        const scope = input.scope ?? 'model-drift';
        const dryRun = input.dryRun === true;
        let documentIds;
        if (scope === 'all') {
            const rows = await this.typeOrmDocumentRepository.find({
                select: { id: true },
                where: { tenantId, organizationId, knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.INDEXED }
            });
            documentIds = rows.map((row) => row.id);
        }
        else {
            const expectedModel = await this.documentIndexService.expectedEmbeddingModel(tenantId);
            documentIds = await this.documentIndexService.findModelDriftDocumentIds({ tenantId, organizationId }, expectedModel);
        }
        if (!dryRun) {
            for (const documentId of documentIds) {
                await this.docsQueueService.enqueue(constants_1.DOCS_JOB_CHUNK, {
                    documentId,
                    tenantId,
                    organizationId,
                    reason: scope === 'all' ? 'reindex' : 'model-changed',
                    initiatedByUserId: core_1.RequestContext.currentUserId() ?? undefined,
                    // Built by hand rather than via `snapshotOf()`, so the request's correlation id has to be
                    // snapshotted here too — otherwise a sweep's chunk/embed/index logs cannot be tied back
                    // to the request that started it. Null without a request context -> field left absent.
                    correlationId: core_1.RequestContext.currentCorrelationId() ?? undefined,
                    force: scope === 'all'
                }, 
                // Low priority — a sweep must never starve interactive pipeline work.
                { jobId: `docs:chunk:${documentId}:${Date.now()}`, priority: 10 });
            }
            this.logger.log(`Bulk knowledge reindex (${scope}) enqueued ${documentIds.length} documents`);
        }
        return { scope, dryRun, affected: documentIds.length };
    }
    /**
     * `POST /documents/:id/summary/regenerate` — re-runs the classification stage (which
     * regenerates the AI summary) for a READY FILE document with extracted text.
     */
    async regenerateSummary(id) {
        const document = await this.documentService.findOneScoped(id);
        if (document.kind !== contracts_1.DocumentKindEnum.FILE || !document.extractedText) {
            throw new common_1.ConflictException({
                message: 'A summary can only be regenerated for a FILE document with extracted text',
                code: docs_constants_1.DOCS_NOT_READY
            });
        }
        await this.docsQueueService.enqueue(constants_1.DOCS_JOB_CLASSIFY, this.processingService.snapshotOf(document, 'reindex'), 
        // Always run — bypass deterministic-id coalescing against a retained job.
        { jobId: `docs:classify:${document.id}:${Date.now()}` });
        return document;
    }
    /**
     * `GET /knowledge/status` — deployment/index capability probe (§8.3).
     */
    async getStatus() {
        const pgvector = vector_store_registry_1.DocumentVectorStoreRegistry.get(knowledge_constants_1.VECTOR_STORE_PGVECTOR);
        let vectorCapable = false;
        if (pgvector) {
            try {
                vectorCapable = await pgvector.isAvailable();
            }
            catch {
                vectorCapable = false;
            }
        }
        return {
            vectorCapable,
            embeddingProviderConfigured: this.docsAiService.embeddingProviderConfigured(),
            embeddingModel: (0, docs_config_1.getDocsConfig)().embeddingModel
        };
    }
    /** FOLDER documents are never indexable (§2). */
    assertIndexable(document) {
        if (document.kind === contracts_1.DocumentKindEnum.FOLDER) {
            throw new common_1.ConflictException({
                message: 'FOLDER documents cannot enter AI knowledge',
                code: docs_constants_1.DOCS_NOT_INDEXABLE
            });
        }
    }
    /** Request-path knowledge-status write with event emission. */
    async setKnowledgeStatus(document, next) {
        const previous = document.knowledgeStatus;
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { knowledgeStatus: next });
        document.knowledgeStatus = next;
        this.documentService.emitDocumentEvent(document, 'updated', { phase: 'knowledge', previous, next });
    }
};
exports.DocumentKnowledgeService = DocumentKnowledgeService;
exports.DocumentKnowledgeService = DocumentKnowledgeService = DocumentKnowledgeService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_processing_service_1.DocumentProcessingService,
        document_index_service_1.DocumentIndexService,
        docs_queue_service_1.DocsQueueService,
        docs_ai_service_1.DocsAiService,
        type_orm_document_repository_1.TypeOrmDocumentRepository])
], DocumentKnowledgeService);
//# sourceMappingURL=document-knowledge.service.js.map