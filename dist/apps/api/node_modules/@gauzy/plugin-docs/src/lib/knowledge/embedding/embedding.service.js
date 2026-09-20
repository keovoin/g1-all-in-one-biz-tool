"use strict";
var EmbeddingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const docs_config_1 = require("../../docs.config");
const errors_1 = require("../errors");
const docs_ai_service_1 = require("../ai/docs-ai.service");
/**
 * Chunk/query embedding through the provider-resolved embedding model
 * (§7 of the AI-knowledge spec).
 *
 * - Model: `GAUZY_DOCS_EMBEDDING_MODEL` (default `text-embedding-3-small`), dimensions
 *   pinned to `GAUZY_DOCS_EMBEDDING_DIMS` (default 1536) — a vector of any other length is
 *   rejected with a permanent error naming the setting, so a mis-configured model can
 *   never write vectors that do not fit the `vector(1536)` column.
 * - Batching: `embedMany` with ≤ `GAUZY_DOCS_EMBED_BATCH_SIZE` (hard max 64) inputs.
 * - Every call site emits a `DocsAiUsageEvent` (debug-logged in P0).
 * - No provider ⇒ `null` resolution upstream ⇒ the caller runs lexical-only. This service
 *   is only invoked with an already-resolved model.
 */
let EmbeddingService = EmbeddingService_1 = class EmbeddingService {
    constructor(docsAiService) {
        this.docsAiService = docsAiService;
        this.logger = new common_1.Logger(EmbeddingService_1.name);
    }
    /**
     * Resolves the tenant's embedding model (`null` = lexical-only path).
     */
    resolve(tenantId) {
        return this.docsAiService.resolveEmbeddingModel(tenantId);
    }
    /**
     * Embeds a batch of chunk texts (≤ the configured batch size per provider call).
     *
     * @param resolved The resolved embedding model handle.
     * @param texts The chunk contents, in order.
     * @param scope Tenant/org snapshot for usage accounting.
     * @param feature Usage feature tag (`docs-embed` for chunks, `docs-query-embed` for queries).
     * @returns One embedding per input, in the same order.
     */
    async embedBatch(resolved, texts, scope, feature = 'docs-embed') {
        if (!texts.length) {
            return [];
        }
        const sdk = await this.docsAiService.loadAiSdk();
        if (!sdk) {
            throw new errors_1.DocsTransientError('The AI SDK could not be loaded for embedding.');
        }
        const config = (0, docs_config_1.getDocsConfig)();
        const batchSize = Math.min(Math.max(config.embedBatchSize, 1), 64);
        // Providers reject empty strings — such chunks should not exist post-chunker, but
        // the guard stays (§7.3).
        const values = texts.map((text) => (text && text.trim().length ? text : ' '));
        const embeddings = [];
        for (let offset = 0; offset < values.length; offset += batchSize) {
            const batch = values.slice(offset, offset + batchSize);
            const startedAt = Date.now();
            try {
                const result = await sdk.embedMany({
                    model: resolved.model,
                    values: batch,
                    // Dimensions pinned in the request where the provider supports the option
                    // (e.g. OpenAI `dimensions`); the hard length check below is the guarantee.
                    providerOptions: { [resolved.providerId]: { dimensions: resolved.dims } }
                });
                const reportedTokens = Number(result.usage?.tokens);
                this.docsAiService.emitUsage({
                    tenantId: scope.tenantId,
                    organizationId: scope.organizationId,
                    feature,
                    providerId: resolved.providerId,
                    model: resolved.modelId,
                    inputTokens: Number.isFinite(reportedTokens)
                        ? reportedTokens
                        : Math.ceil(batch.join(' ').length / 4),
                    outputTokens: 0,
                    estimated: !Number.isFinite(reportedTokens),
                    durationMs: Date.now() - startedAt,
                    success: true
                });
                for (const embedding of result.embeddings) {
                    if (!Array.isArray(embedding) || embedding.length !== resolved.dims) {
                        throw new errors_1.DocsPermanentError(`The embedding model '${resolved.modelId}' returned ${embedding?.length ?? 0} dimensions ` +
                            `but GAUZY_DOCS_EMBEDDING_DIMS is ${resolved.dims} — fix the model or the setting.`);
                    }
                    embeddings.push(embedding);
                }
            }
            catch (error) {
                if (!(error instanceof errors_1.DocsPermanentError)) {
                    this.docsAiService.emitUsage({
                        tenantId: scope.tenantId,
                        organizationId: scope.organizationId,
                        feature,
                        providerId: resolved.providerId,
                        model: resolved.modelId,
                        inputTokens: Math.ceil(batch.join(' ').length / 4),
                        outputTokens: 0,
                        estimated: true,
                        durationMs: Date.now() - startedAt,
                        success: false
                    });
                }
                throw error;
            }
        }
        return embeddings;
    }
    /**
     * Embeds one retrieval query. Returns `null` on ANY failure — a transient provider
     * error degrades the QUERY (lexical-only leg), never the request (§9.3).
     */
    async embedQuery(resolved, query, scope) {
        try {
            const [embedding] = await this.embedBatch(resolved, [query], scope, 'docs-query-embed');
            return embedding ?? null;
        }
        catch (error) {
            this.logger.debug(`Query embedding failed — degrading to lexical-only: ${error.message}`);
            return null;
        }
    }
};
exports.EmbeddingService = EmbeddingService;
exports.EmbeddingService = EmbeddingService = EmbeddingService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [docs_ai_service_1.DocsAiService])
], EmbeddingService);
//# sourceMappingURL=embedding.service.js.map