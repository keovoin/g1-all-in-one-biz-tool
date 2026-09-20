import { ID } from '@gauzy/contracts';
import { DocsAiService, IResolvedEmbeddingModel } from '../ai/docs-ai.service';
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
export declare class EmbeddingService {
    private readonly docsAiService;
    private readonly logger;
    constructor(docsAiService: DocsAiService);
    /**
     * Resolves the tenant's embedding model (`null` = lexical-only path).
     */
    resolve(tenantId: ID): Promise<IResolvedEmbeddingModel | null>;
    /**
     * Embeds a batch of chunk texts (≤ the configured batch size per provider call).
     *
     * @param resolved The resolved embedding model handle.
     * @param texts The chunk contents, in order.
     * @param scope Tenant/org snapshot for usage accounting.
     * @param feature Usage feature tag (`docs-embed` for chunks, `docs-query-embed` for queries).
     * @returns One embedding per input, in the same order.
     */
    embedBatch(resolved: IResolvedEmbeddingModel, texts: string[], scope: {
        tenantId: ID;
        organizationId: ID;
    }, feature?: 'docs-embed' | 'docs-query-embed'): Promise<number[][]>;
    /**
     * Embeds one retrieval query. Returns `null` on ANY failure — a transient provider
     * error degrades the QUERY (lexical-only leg), never the request (§9.3).
     */
    embedQuery(resolved: IResolvedEmbeddingModel, query: string, scope: {
        tenantId: ID;
        organizationId: ID;
    }): Promise<number[] | null>;
}
