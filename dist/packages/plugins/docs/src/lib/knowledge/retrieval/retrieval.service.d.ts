import { ID } from '@gauzy/contracts';
import { TypeOrmDocumentCategoryRepository } from '../../repositories/type-orm-document-category.repository';
import { TypeOrmDocumentRepository } from '../../repositories/type-orm-document.repository';
import { DocumentAccessService } from '../../services/document-access.service';
import { IDocsRetrievalLog } from '../../telemetry/retrieval-log.types';
import { EmbeddingService } from '../embedding/embedding.service';
/**
 * The caller-facing search input (validated by `KnowledgeSearchDTO` on the HTTP path).
 * The chat-tool surface additionally passes `categorySlugs` / `kind` (§11.2) — both are
 * normalized here so the tools and the endpoint share one execution path.
 */
export interface IKnowledgeSearchInput {
    query: string;
    topK?: number;
    documentIds?: ID[];
    categoryIds?: ID[];
    /** Chat-tool facet: category slugs resolved against the tenant catalog. */
    categorySlugs?: string[];
    tagIds?: ID[];
    kinds?: any[];
    /** Chat-tool facet: a single kind ('FILE' | 'PAGE'). */
    kind?: string;
    entity?: any;
    entityId?: ID;
    /** Retrieval-log consumer tag (§16, P2) — accepted and currently unused. */
    consumerKind?: 'knowledge-search' | 'chat-tool' | 'attach-picker';
}
/** One hit of the §9.5 response contract. */
export interface IKnowledgeSearchHit {
    chunkId: ID;
    documentId: ID;
    chunkIndex: number;
    score: number;
    content: string;
    locator: {
        headingPath: string[];
        page: number | null;
        sheet: string | null;
        charRange: {
            start: number;
            end: number;
        } | null;
    };
    document: {
        id: ID;
        name: string;
        kind: string;
        summary: string | null;
        categories: Array<{
            id: ID;
            slug: string;
            name: string;
        }>;
        updatedAt: Date | string;
    };
}
/** The §9.5 response envelope. Zero hits is HTTP 200 — never an error. */
export interface IKnowledgeSearchResult {
    hits: IKnowledgeSearchHit[];
    lowConfidence: boolean;
    degraded: 'none' | 'lexical-only';
}
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
export declare class DocumentKnowledgeSearchService {
    private readonly typeOrmDocumentRepository;
    private readonly typeOrmDocumentCategoryRepository;
    private readonly embeddingService;
    private readonly documentAccessService;
    /**
     * Telemetry sink (§16) — optional by design so the retrieval path works with the
     * token unbound, and swappable for the P2 table-backed implementation.
     */
    private readonly retrievalLog?;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, typeOrmDocumentCategoryRepository: TypeOrmDocumentCategoryRepository, embeddingService: EmbeddingService, documentAccessService: DocumentAccessService, 
    /**
     * Telemetry sink (§16) — optional by design so the retrieval path works with the
     * token unbound, and swappable for the P2 table-backed implementation.
     */
    retrievalLog?: IDocsRetrievalLog);
    /**
     * Runs one knowledge search for the requesting user.
     */
    search(input: IKnowledgeSearchInput): Promise<IKnowledgeSearchResult>;
    /**
     * Resolves the tenant/organization/user scope of the request. Retrieval runs on the HTTP
     * request path, so everything but the fallback organization comes from `RequestContext`.
     *
     * @param input The caller-facing search input.
     * @returns The resolved scope plus the telemetry consumer tag.
     */
    private resolveRequestScope;
    /**
     * Chat-tool facet (§11.2): resolves `categorySlugs` against the tenant catalog, but only
     * when the caller did not already pass explicit `categoryIds`.
     *
     * @returns The category ids to filter on, plus `unknownSlugs` — true when slugs were given
     *          and NONE of them exists in the catalog, which must yield the honest empty set
     *          rather than a silently unfiltered search.
     */
    private resolveCategoryIds;
    /**
     * Chat-tool facet (§11.2): the single `kind` is normalized into the `kinds` array so the
     * tools and the HTTP endpoint share one filter shape.
     */
    private resolveKinds;
    /**
     * Lexical leg — always runs (the floor of the ladder); contributes nothing when no lexical
     * store is registered at all.
     */
    private runLexicalLeg;
    /**
     * Vector leg — best-effort (§10). It is skipped (and the response degrades to
     * `lexical-only`) when pgvector is absent, AI is disabled, no embedding provider resolves
     * for the tenant, or the query-embed call fails.
     *
     * @returns The vector hits, or `null` when the leg did not run.
     */
    private runVectorLeg;
    /**
     * The store id recorded on the retrieval event: the vector store when the hybrid leg ran,
     * the lexical store otherwise.
     */
    private resolveLoggedStoreId;
    /**
     * Hands one retrieval event to the telemetry sink. Fire-and-forget by contract —
     * telemetry must never slow or fail a search, so the call is fully guarded here on top
     * of the sink's own guards.
     *
     * @param event The content-free retrieval event.
     */
    private logRetrieval;
    /**
     * Loads the nested document metadata (name, kind, summary, categories, updatedAt) for
     * the fused hit set and shapes the §9.5 response objects.
     */
    private hydrateHits;
    /**
     * One leg query that can never fail the request — a broken leg logs and contributes
     * nothing.
     */
    private safeQuery;
}
