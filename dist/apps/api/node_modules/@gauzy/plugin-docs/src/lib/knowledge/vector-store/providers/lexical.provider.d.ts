import { ID } from '@gauzy/contracts';
import { TypeOrmDocumentChunkRepository } from '../../../repositories/type-orm-document-chunk.repository';
import { IDocumentVectorStore, IVectorStoreChunk, IVectorStoreHit, IVectorStoreQuery, IVectorStoreScope } from '../vector-store.interface';
/**
 * The always-available lexical store (the retrieval degradation floor, §9.3/§10).
 *
 * - PostgreSQL: `websearch_to_tsquery('simple', :q)` against the GIN expression index
 *   (`to_tsvector('simple', content)`), ranked by `ts_rank_cd`. When the parsed tsquery is
 *   empty (stop-words-only or a < 3-char query), fall back to an ILIKE OR-list over up to
 *   12 query terms, ranked by matched-term count.
 * - MySQL / SQLite: the LIKE variant only.
 *
 * `upsertChunks`/`deleteByDocument` are no-ops — the `document_chunk` rows ARE this store.
 */
export declare class LexicalStoreProvider implements IDocumentVectorStore {
    private readonly typeOrmDocumentChunkRepository;
    readonly id = "lexical";
    private readonly logger;
    constructor(typeOrmDocumentChunkRepository: TypeOrmDocumentChunkRepository);
    /**
     * @inheritdoc — the lexical store is the floor of the ladder: always available.
     */
    isAvailable(): Promise<boolean>;
    /** No-op: chunk rows are written by the index service. */
    upsertChunks(_scope: IVectorStoreScope, _documentId: ID, _chunks: IVectorStoreChunk[]): Promise<void>;
    /** No-op: chunk rows are removed by the index service. */
    deleteByDocument(_scope: IVectorStoreScope, _documentId: ID): Promise<void>;
    /**
     * @inheritdoc
     */
    query(query: IVectorStoreQuery): Promise<IVectorStoreHit[]>;
    /**
     * True when `websearch_to_tsquery('simple', text)` parses to a non-empty query.
     */
    private tsQueryParses;
    /**
     * PostgreSQL full-text leg: GIN-indexed tsvector match ranked by `ts_rank_cd`
     * (clamped into [0, 1]).
     */
    private fullTextQuery;
    /**
     * The ILIKE/LIKE floor: an OR-list over up to 12 terms, ranked by matched-term
     * fraction (score = matched / total ∈ [0, 1]).
     */
    private likeQuery;
    private toHit;
}
