"use strict";
var DocumentKnowledgeSearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentKnowledgeSearchService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../../docs.config");
const docs_constants_1 = require("../../docs.constants");
const type_orm_document_category_repository_1 = require("../../repositories/type-orm-document-category.repository");
const type_orm_document_repository_1 = require("../../repositories/type-orm-document.repository");
const document_access_service_1 = require("../../services/document-access.service");
const retrieval_log_types_1 = require("../../telemetry/retrieval-log.types");
const embedding_service_1 = require("../embedding/embedding.service");
const knowledge_constants_1 = require("../knowledge.constants");
const vector_store_registry_1 = require("../vector-store/vector-store.registry");
const rrf_1 = require("./rrf");
/**
 * Hybrid lexical + vector retrieval with Reciprocal Rank Fusion (§9).
 *
 * Runs on the HTTP request path (knowledge-search endpoint and the AI-chat tools), so the
 * tenant/organization/user scope comes from `RequestContext`. Both legs are oversampled at
 * `topK * 2` and share the identical mandatory SQL filter set (`retrieval-filters.ts`).
 *
 * The service NEVER fails a request over AI availability: the vector leg is skipped when
 * pgvector is absent, no embedding provider resolves, or the query-embed call fails —
 * the response degrades to `lexical-only` (§10).
 */
let DocumentKnowledgeSearchService = DocumentKnowledgeSearchService_1 = class DocumentKnowledgeSearchService {
    constructor(typeOrmDocumentRepository, typeOrmDocumentCategoryRepository, embeddingService, documentAccessService, retrievalLog) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.typeOrmDocumentCategoryRepository = typeOrmDocumentCategoryRepository;
        this.embeddingService = embeddingService;
        this.documentAccessService = documentAccessService;
        this.retrievalLog = retrievalLog;
        this.logger = new common_1.Logger(DocumentKnowledgeSearchService_1.name);
    }
    /**
     * Runs one knowledge search for the requesting user.
     */
    async search(input) {
        const startedAt = Date.now();
        const { tenantId, organizationId, userId, employeeId, hasManagePermission, consumerKind } = this.resolveRequestScope(input);
        const queryLength = input.query?.length ?? 0;
        const config = (0, docs_config_1.getDocsConfig)();
        const topK = Math.min(Math.max(input.topK ?? docs_constants_1.DEFAULT_DOCS_RETRIEVAL_TOPK, 1), config.retrievalTopKMax);
        const oversample = topK * 2;
        // Chat-tool facets (§11.2): slugs → catalog ids; single kind → kinds array.
        const { categoryIds, unknownSlugs } = await this.resolveCategoryIds(input, tenantId, organizationId);
        if (unknownSlugs) {
            // Unknown slugs would silently widen the search — return the honest empty set.
            this.logRetrieval({
                tenantId,
                organizationId,
                consumerKind,
                queryLength,
                resultCount: 0,
                documentCount: 0,
                latencyMs: Date.now() - startedAt,
                mode: 'lexical-only',
                topScore: null,
                lowConfidence: true,
                storeId: null
            });
            return { hits: [], lowConfidence: true, degraded: 'lexical-only' };
        }
        const filters = {
            userId,
            employeeId,
            hasManagePermission,
            documentIds: input.documentIds,
            categoryIds,
            tagIds: input.tagIds,
            kinds: this.resolveKinds(input),
            entity: input.entity,
            entityId: input.entityId
        };
        const scope = { tenantId, organizationId, filters };
        // Resolve the active store once per request.
        const store = await vector_store_registry_1.DocumentVectorStoreRegistry.resolve();
        const lexicalStore = vector_store_registry_1.DocumentVectorStoreRegistry.get(knowledge_constants_1.VECTOR_STORE_LEXICAL) ?? store;
        // Lexical leg — always runs (the floor of the ladder).
        const lexicalHits = await this.runLexicalLeg(lexicalStore, scope, input.query, oversample);
        // Vector leg — best-effort; `null` means the leg never ran.
        const vectorHits = await this.runVectorLeg(store, scope, {
            aiEnabled: config.aiEnabled,
            query: input.query,
            topK: oversample
        });
        const vectorLegRan = vectorHits !== null;
        const degraded = vectorLegRan ? 'none' : 'lexical-only';
        const mode = vectorLegRan ? 'hybrid' : 'lexical-only';
        const storeId = this.resolveLoggedStoreId(vectorLegRan, store, lexicalStore);
        // RRF fusion (k = 60), deduped by chunk id, truncated to topK.
        const fused = (0, rrf_1.fuseRrf)(vectorLegRan ? [lexicalHits, vectorHits] : [lexicalHits], topK);
        if (!fused.length) {
            // A zero-result search is the knowledge-gap signal — the ONLY place it is captured.
            this.logRetrieval({
                tenantId,
                organizationId,
                consumerKind,
                queryLength,
                resultCount: 0,
                documentCount: 0,
                latencyMs: Date.now() - startedAt,
                mode,
                topScore: null,
                lowConfidence: true,
                storeId
            });
            return { hits: [], lowConfidence: true, degraded };
        }
        // Low-confidence caveat: RRF floor in hybrid mode; matched-fraction floor when
        // degraded to lexical-only (§9.4).
        const lowConfidence = vectorLegRan
            ? fused[0].score < rrf_1.RRF_CONFIDENCE_FLOOR
            : Math.max(...lexicalHits.map((hit) => hit.score), 0) < knowledge_constants_1.DOCS_LEXICAL_CONFIDENCE_FLOOR;
        const hits = await this.hydrateHits(fused.map((entry) => ({ ...entry.hit, score: entry.score })));
        this.logRetrieval({
            tenantId,
            organizationId,
            consumerKind,
            queryLength,
            resultCount: hits.length,
            documentCount: new Set(hits.map((hit) => hit.documentId)).size,
            latencyMs: Date.now() - startedAt,
            mode,
            topScore: hits.length ? hits[0].score : null,
            lowConfidence,
            storeId
        });
        return { hits, lowConfidence, degraded };
    }
    /**
     * Resolves the tenant/organization/user scope of the request. Retrieval runs on the HTTP
     * request path, so everything but the fallback organization comes from `RequestContext`.
     *
     * @param input The caller-facing search input.
     * @returns The resolved scope plus the telemetry consumer tag.
     */
    resolveRequestScope(input) {
        return {
            tenantId: core_1.RequestContext.currentTenantId(),
            organizationId: (core_1.RequestContext.currentOrganizationId() ?? input.organizationId),
            userId: core_1.RequestContext.currentUserId(),
            // The share overlay is employee/team scoped (08 §3.3) — without it, PRIVATE documents
            // shared with the requester would be invisible to retrieval but visible in the list.
            employeeId: this.documentAccessService.currentEmployeeId() ?? undefined,
            hasManagePermission: core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.DOCS_MANAGE),
            consumerKind: input.consumerKind ?? 'knowledge-search'
        };
    }
    /**
     * Chat-tool facet (§11.2): resolves `categorySlugs` against the tenant catalog, but only
     * when the caller did not already pass explicit `categoryIds`.
     *
     * @returns The category ids to filter on, plus `unknownSlugs` — true when slugs were given
     *          and NONE of them exists in the catalog, which must yield the honest empty set
     *          rather than a silently unfiltered search.
     */
    async resolveCategoryIds(input, tenantId, organizationId) {
        if (input.categoryIds?.length || !input.categorySlugs?.length) {
            return { categoryIds: input.categoryIds, unknownSlugs: false };
        }
        const categories = await this.typeOrmDocumentCategoryRepository.find({
            where: { tenantId, organizationId, slug: (0, typeorm_1.In)(input.categorySlugs) }
        });
        const categoryIds = categories.map((category) => category.id);
        return { categoryIds, unknownSlugs: !categoryIds.length };
    }
    /**
     * Chat-tool facet (§11.2): the single `kind` is normalized into the `kinds` array so the
     * tools and the HTTP endpoint share one filter shape.
     */
    resolveKinds(input) {
        if (input.kinds?.length) {
            return input.kinds;
        }
        return input.kind ? [input.kind] : undefined;
    }
    /**
     * Lexical leg — always runs (the floor of the ladder); contributes nothing when no lexical
     * store is registered at all.
     */
    async runLexicalLeg(lexicalStore, scope, query, topK) {
        if (!lexicalStore) {
            return [];
        }
        return this.safeQuery(lexicalStore, { ...scope, text: query, topK });
    }
    /**
     * Vector leg — best-effort (§10). It is skipped (and the response degrades to
     * `lexical-only`) when pgvector is absent, AI is disabled, no embedding provider resolves
     * for the tenant, or the query-embed call fails.
     *
     * @returns The vector hits, or `null` when the leg did not run.
     */
    async runVectorLeg(store, scope, options) {
        if (!store || store.id === knowledge_constants_1.VECTOR_STORE_LEXICAL || !options.aiEnabled) {
            return null;
        }
        const resolved = await this.embeddingService.resolve(scope.tenantId);
        if (!resolved) {
            return null;
        }
        const embedding = await this.embeddingService.embedQuery(resolved, options.query, {
            tenantId: scope.tenantId,
            organizationId: scope.organizationId
        });
        if (!embedding) {
            return null;
        }
        return this.safeQuery(store, { ...scope, embedding, topK: options.topK });
    }
    /**
     * The store id recorded on the retrieval event: the vector store when the hybrid leg ran,
     * the lexical store otherwise.
     */
    resolveLoggedStoreId(vectorLegRan, store, lexicalStore) {
        return vectorLegRan ? store?.id ?? null : lexicalStore?.id ?? null;
    }
    /**
     * Hands one retrieval event to the telemetry sink. Fire-and-forget by contract —
     * telemetry must never slow or fail a search, so the call is fully guarded here on top
     * of the sink's own guards.
     *
     * @param event The content-free retrieval event.
     */
    logRetrieval(event) {
        try {
            this.retrievalLog?.recordRetrieval(event);
        }
        catch (error) {
            this.logger.debug(`Retrieval telemetry failed: ${error.message}`);
        }
    }
    /**
     * Loads the nested document metadata (name, kind, summary, categories, updatedAt) for
     * the fused hit set and shapes the §9.5 response objects.
     */
    async hydrateHits(hits) {
        const documentIds = [...new Set(hits.map((hit) => hit.documentId))];
        const documents = await this.typeOrmDocumentRepository.find({
            where: { id: (0, typeorm_1.In)(documentIds) },
            relations: { categories: true }
        });
        const byId = new Map(documents.map((document) => [document.id, document]));
        return hits
            .filter((hit) => byId.has(hit.documentId))
            .map((hit) => {
            const document = byId.get(hit.documentId);
            const metadata = hit.metadata;
            return {
                chunkId: hit.chunkId,
                documentId: hit.documentId,
                chunkIndex: hit.chunkIndex,
                score: hit.score,
                content: hit.content,
                locator: {
                    headingPath: metadata?.headingPath ?? [],
                    page: metadata?.page ?? null,
                    sheet: metadata?.sheet ?? null,
                    charRange: metadata?.charRange ?? null
                },
                document: {
                    id: document.id,
                    name: document.name,
                    kind: document.kind,
                    summary: document.summary ?? null,
                    categories: (document.categories ?? []).map((category) => ({
                        id: category.id,
                        slug: category.slug,
                        name: category.name
                    })),
                    updatedAt: document.updatedAt
                }
            };
        });
    }
    /**
     * One leg query that can never fail the request — a broken leg logs and contributes
     * nothing.
     */
    async safeQuery(store, query) {
        try {
            return await store.query(query);
        }
        catch (error) {
            this.logger.warn(`Vector store '${store.id}' query failed: ${error.message}`);
            return [];
        }
    }
};
exports.DocumentKnowledgeSearchService = DocumentKnowledgeSearchService;
exports.DocumentKnowledgeSearchService = DocumentKnowledgeSearchService = DocumentKnowledgeSearchService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(4, (0, common_1.Optional)()),
    tslib_1.__param(4, (0, common_1.Inject)(retrieval_log_types_1.DOCS_RETRIEVAL_LOG)),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        type_orm_document_category_repository_1.TypeOrmDocumentCategoryRepository,
        embedding_service_1.EmbeddingService,
        document_access_service_1.DocumentAccessService, Object])
], DocumentKnowledgeSearchService);
//# sourceMappingURL=retrieval.service.js.map