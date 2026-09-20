"use strict";
var DocumentIndexService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentIndexService = void 0;
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const docs_config_1 = require("../../docs.config");
const document_chunk_entity_1 = require("../../entities/document-chunk.entity");
const document_index_state_entity_1 = require("../../entities/document-index-state.entity");
const type_orm_document_chunk_repository_1 = require("../../repositories/type-orm-document-chunk.repository");
const type_orm_document_index_state_repository_1 = require("../../repositories/type-orm-document-index-state.repository");
const type_orm_document_repository_1 = require("../../repositories/type-orm-document.repository");
const markdown_chunker_1 = require("../chunking/markdown-chunker");
const embedding_service_1 = require("../embedding/embedding.service");
const errors_1 = require("../errors");
const knowledge_constants_1 = require("../knowledge.constants");
const vector_store_registry_1 = require("../vector-store/vector-store.registry");
const page_markdown_renderer_1 = require("./page-markdown.renderer");
/**
 * The knowledge indexing engine (§6/§8 of the AI-knowledge spec): chunk replacement,
 * embedding writes through the vector-store seam, `document_index_state` bookkeeping, and
 * the `contentHash` skip-if-unchanged short-circuit.
 *
 * Worker-safe by construction: every query carries the explicit tenant/organization
 * snapshot of the job payload; `RequestContext` is never consulted.
 *
 * Stage layout (restart-safe because the chunker is deterministic):
 * - **chunk** — transactionally replaces the chunk set (embeddings NULL) and moves the
 *   document to `INDEXING`. Retrieval only ever surfaces `INDEXED` documents, so no
 *   partially-replaced set is ever visible.
 * - **embed** — resolves provider + store; batches `embedMany`; writes vectors through
 *   `IDocumentVectorStore.upsertChunks` as batches return. No provider / lexical store ⇒
 *   skipped entirely (lexical-only ingestion).
 * - **index** — verifies embedding completeness, upserts `document_index_state`, records
 *   `metadata.indexing`, flips `knowledgeStatus: INDEXED`.
 */
let DocumentIndexService = DocumentIndexService_1 = class DocumentIndexService {
    constructor(typeOrmDocumentRepository, typeOrmDocumentChunkRepository, typeOrmDocumentIndexStateRepository, embeddingService) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.typeOrmDocumentChunkRepository = typeOrmDocumentChunkRepository;
        this.typeOrmDocumentIndexStateRepository = typeOrmDocumentIndexStateRepository;
        this.embeddingService = embeddingService;
        this.logger = new common_1.Logger(DocumentIndexService_1.name);
    }
    /** SHA-256 hex digest of the normalized markdown that gets chunked. */
    contentHashOf(markdown) {
        return (0, crypto_1.createHash)('sha256').update(markdown, 'utf8').digest('hex');
    }
    /**
     * The embedding model this deployment would index with right now: the configured model
     * when a provider resolves AND the active store accepts vectors, else the lexical
     * sentinel. Drives both the skip-if-unchanged check and the model-drift sweep.
     */
    async expectedEmbeddingModel(tenantId) {
        const store = await vector_store_registry_1.DocumentVectorStoreRegistry.resolve();
        if (!store || store.id === knowledge_constants_1.VECTOR_STORE_LEXICAL) {
            return knowledge_constants_1.LEXICAL_ONLY_EMBEDDING_MODEL;
        }
        const resolved = await this.embeddingService.resolve(tenantId);
        return resolved ? resolved.modelId : knowledge_constants_1.LEXICAL_ONLY_EMBEDDING_MODEL;
    }
    /**
     * `docs.chunk` stage: resolves the knowledge markdown, short-circuits on an unchanged
     * `contentHash` + embedding model, else transactionally replaces the chunk set.
     */
    async runChunkStage(document, job) {
        const markdown = (0, page_markdown_renderer_1.renderKnowledgeMarkdown)(document);
        if (!markdown) {
            throw new errors_1.DocsPermanentError('The document has no extractable content to index.');
        }
        const contentHash = this.contentHashOf(markdown);
        const expectedModel = await this.expectedEmbeddingModel(job.tenantId);
        // §8.2 skip-if-unchanged: same content, same model ⇒ zero AI spend.
        if (!job.force) {
            const state = await this.typeOrmDocumentIndexStateRepository.findOne({
                where: { documentId: document.id, tenantId: job.tenantId, organizationId: job.organizationId }
            });
            if (state && state.contentHash === contentHash && state.embeddingModel === expectedModel) {
                await this.setKnowledgeStatus(document, contracts_1.DocumentKnowledgeStatusEnum.INDEXED);
                this.logger.debug(`docs.chunk short-circuit for document ${document.id} — content and model unchanged`);
                return { outcome: 'skipped-unchanged', contentHash };
            }
        }
        await this.setKnowledgeStatus(document, contracts_1.DocumentKnowledgeStatusEnum.INDEXING);
        const config = (0, docs_config_1.getDocsConfig)();
        const result = (0, markdown_chunker_1.chunkMarkdown)(markdown, {
            chunkTokens: config.chunkTokens,
            overlapTokens: config.chunkOverlapTokens
        });
        // Transactional wholesale replace (embeddings NULL until the embed stage).
        await this.typeOrmDocumentChunkRepository.manager.transaction(async (manager) => {
            await manager.delete(document_chunk_entity_1.DocumentChunk, {
                tenantId: job.tenantId,
                organizationId: job.organizationId,
                documentId: document.id
            });
            const rows = result.chunks.map((chunk) => ({
                tenantId: job.tenantId,
                organizationId: job.organizationId,
                documentId: document.id,
                chunkIndex: chunk.chunkIndex,
                content: chunk.content,
                tokenCount: chunk.tokenCount,
                metadata: chunk.metadata,
                embedding: null
            }));
            // Bounded batches keep the parameter count under every dialect's limit.
            const repository = manager.getRepository(document_chunk_entity_1.DocumentChunk);
            for (let offset = 0; offset < rows.length; offset += 100) {
                await repository.insert(rows.slice(offset, offset + 100));
            }
        });
        // The token counter used is recorded per run so drift is diagnosable (§6).
        await this.mergeIndexingMetadata(document, { tokenCounter: result.tokenCounter });
        this.logger.log(`docs.chunk wrote ${result.chunks.length} chunks for document ${document.id} (hash ${contentHash.slice(0, 12)}…)`);
        return { outcome: 'chunked', contentHash };
    }
    /**
     * `docs.embed` stage: provider-resolved batched embedding written through the active
     * vector store. Lexical-only conditions (AI disabled, no provider, lexical store) skip
     * cleanly with `embeddingModel: null`.
     */
    async runEmbedStage(document, job) {
        const config = (0, docs_config_1.getDocsConfig)();
        const scope = { tenantId: job.tenantId, organizationId: job.organizationId };
        if (!config.aiEnabled) {
            this.logger.debug(`docs.embed skipped for document ${document.id} — AI is disabled (lexical-only)`);
            return { embeddingModel: null, embeddingDims: null };
        }
        const store = await vector_store_registry_1.DocumentVectorStoreRegistry.resolve();
        if (!store || store.id === knowledge_constants_1.VECTOR_STORE_LEXICAL) {
            this.logger.debug(`docs.embed skipped for document ${document.id} — no vector-capable store`);
            return { embeddingModel: null, embeddingDims: null };
        }
        const resolved = await this.embeddingService.resolve(job.tenantId);
        if (!resolved) {
            this.logger.debug(`docs.embed skipped for document ${document.id} — no embedding provider resolves`);
            return { embeddingModel: null, embeddingDims: null };
        }
        const chunks = await this.typeOrmDocumentChunkRepository.find({
            where: { tenantId: job.tenantId, organizationId: job.organizationId, documentId: document.id },
            order: { chunkIndex: 'ASC' }
        });
        if (!chunks.length) {
            return { embeddingModel: null, embeddingDims: null };
        }
        const batchSize = Math.min(Math.max(config.embedBatchSize, 1), 64);
        for (let offset = 0; offset < chunks.length; offset += batchSize) {
            const batch = chunks.slice(offset, offset + batchSize);
            const embeddings = await this.embeddingService.embedBatch(resolved, batch.map((chunk) => chunk.content), scope);
            // Vectors land chunk-by-chunk as batches return (§7.3) — a poisoned later batch
            // never loses the batches already written.
            await store.upsertChunks(scope, document.id, batch.map((chunk, index) => ({
                chunkId: chunk.id,
                chunkIndex: chunk.chunkIndex,
                content: chunk.content,
                embedding: embeddings[index]
            })));
        }
        return { embeddingModel: resolved.modelId, embeddingDims: resolved.dims };
    }
    /**
     * `docs.index` stage: completeness verification, `document_index_state` upsert, and
     * the `INDEXED` flip.
     */
    async runIndexStage(document, job) {
        const scope = { tenantId: job.tenantId, organizationId: job.organizationId };
        const chunkCount = await this.typeOrmDocumentChunkRepository.count({
            where: { ...scope, documentId: document.id }
        });
        const embeddingModel = job.embeddingModel ?? knowledge_constants_1.LEXICAL_ONLY_EMBEDDING_MODEL;
        const embeddingDims = job.embeddingDims ?? knowledge_constants_1.LEXICAL_ONLY_EMBEDDING_DIMS;
        // Verify completeness before flipping to INDEXED (§7.3): every chunk of an embedded
        // run must carry a vector. A gap means a crash between stages — transient; the
        // recovery scan re-runs from `docs.chunk`.
        if (job.embeddingModel) {
            const missing = await this.typeOrmDocumentChunkRepository.count({
                where: { ...scope, documentId: document.id, embedding: (0, typeorm_1.IsNull)() }
            });
            if (missing > 0) {
                throw new errors_1.DocsTransientError(`Document ${document.id} has ${missing}/${chunkCount} chunks without embeddings — re-run embed.`);
            }
        }
        // Upsert the single bookkeeping row per document.
        const existing = await this.typeOrmDocumentIndexStateRepository.findOne({
            where: { ...scope, documentId: document.id }
        });
        if (existing) {
            await this.typeOrmDocumentIndexStateRepository.update({ id: existing.id, ...scope }, {
                embeddingModel,
                embeddingDims,
                chunkCount,
                lastIndexedAt: new Date(),
                contentHash: job.contentHash
            });
        }
        else {
            await this.typeOrmDocumentIndexStateRepository.insert({
                ...scope,
                documentId: document.id,
                embeddingModel,
                embeddingDims,
                chunkCount,
                lastIndexedAt: new Date(),
                contentHash: job.contentHash
            });
        }
        // The lexical-only marker lives in the index metadata (+ the sentinel model above).
        await this.mergeIndexingMetadata(document, {
            embeddingModel: job.embeddingModel,
            lexicalOnly: !job.embeddingModel,
            indexedAt: new Date().toISOString()
        });
        await this.setKnowledgeStatus(document, contracts_1.DocumentKnowledgeStatusEnum.INDEXED);
        this.logger.log(`docs.index completed for document ${document.id}: ${chunkCount} chunks, model=${embeddingModel}`);
    }
    /**
     * Removes one document's knowledge projection (chunks + index state) in one
     * transaction — the exclude/reject cleanup. Idempotent.
     */
    async removeKnowledgeProjection(scope, documentId) {
        await this.typeOrmDocumentChunkRepository.manager.transaction(async (manager) => {
            await manager.delete(document_chunk_entity_1.DocumentChunk, { ...scope, documentId });
            await manager.delete(document_index_state_entity_1.DocumentIndexState, { ...scope, documentId });
        });
    }
    /**
     * Documents of one tenant/org whose index state mismatches the expected embedding
     * model (the §8.4 drift set). Includes lexical-only (`sentinel`) rows once a provider
     * appears, and vice versa.
     */
    async findModelDriftDocumentIds(scope, expectedModel) {
        const rows = await this.typeOrmDocumentIndexStateRepository
            .createQueryBuilder('state')
            .select('state.documentId', 'documentId')
            .where('state.tenantId = :tenantId', { tenantId: scope.tenantId })
            .andWhere('state.organizationId = :organizationId', { organizationId: scope.organizationId })
            .andWhere('state.embeddingModel != :expectedModel', { expectedModel })
            .getRawMany();
        return rows.map((row) => row.documentId);
    }
    /**
     * Worker-safe knowledge-status write (mirrors `DocumentProcessingService` semantics
     * without the request-path coupling).
     */
    async setKnowledgeStatus(document, next) {
        if (document.knowledgeStatus === next) {
            return;
        }
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { knowledgeStatus: next });
        document.knowledgeStatus = next;
    }
    /**
     * Merges keys into `document.metadata.indexing` (sqlite-aware serialization — `update`
     * bypasses the entity subscribers).
     */
    async mergeIndexingMetadata(document, patch) {
        const existing = (document.metadata && typeof document.metadata === 'object' ? document.metadata : {});
        const metadata = { ...existing, indexing: { ...(existing.indexing ?? {}), ...patch } };
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { metadata: (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? JSON.stringify(metadata) : metadata });
        document.metadata = metadata;
    }
};
exports.DocumentIndexService = DocumentIndexService;
exports.DocumentIndexService = DocumentIndexService = DocumentIndexService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        type_orm_document_chunk_repository_1.TypeOrmDocumentChunkRepository,
        type_orm_document_index_state_repository_1.TypeOrmDocumentIndexStateRepository,
        embedding_service_1.EmbeddingService])
], DocumentIndexService);
//# sourceMappingURL=document-index.service.js.map