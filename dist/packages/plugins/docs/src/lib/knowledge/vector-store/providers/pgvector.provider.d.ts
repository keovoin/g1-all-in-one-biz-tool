import { ID } from '@gauzy/contracts';
import { TypeOrmDocumentChunkRepository } from '../../../repositories/type-orm-document-chunk.repository';
import { IDocumentVectorStore, IVectorStoreChunk, IVectorStoreHit, IVectorStoreQuery, IVectorStoreScope } from '../vector-store.interface';
/**
 * The built-in pgvector store: cosine similarity over the `document_chunk.embedding`
 * `vector(1536)` column (ivfflat index, `vector_cosine_ops`), written and queried with
 * raw SQL — the entity declares the column `simple-json` so the ORM stays ignorant of the
 * vector type (§8.3).
 *
 * Availability = PostgreSQL dialect + the `vector` extension present (probed once and
 * cached; consumed by resolution and by `GET /knowledge/status`).
 */
export declare class PgVectorStoreProvider implements IDocumentVectorStore {
    private readonly typeOrmDocumentChunkRepository;
    readonly id = "pgvector";
    private readonly logger;
    private availability;
    constructor(typeOrmDocumentChunkRepository: TypeOrmDocumentChunkRepository);
    /**
     * @inheritdoc
     */
    isAvailable(): Promise<boolean>;
    /** Test/ops seam: clears the cached capability probe. */
    resetAvailabilityProbe(): void;
    /**
     * Writes chunk embeddings with raw SQL (`UPDATE … SET embedding = $vec::vector`),
     * tenant/org-scoped, idempotent per chunk. Chunks without an embedding are skipped.
     */
    upsertChunks(scope: IVectorStoreScope, documentId: ID, chunks: IVectorStoreChunk[]): Promise<void>;
    /**
     * Clears one document's vectors (the chunk rows themselves are owned by the index
     * service's transactional replace).
     */
    deleteByDocument(scope: IVectorStoreScope, documentId: ID): Promise<void>;
    /**
     * Cosine-distance query (`embedding <=> :vec`) under the full mandatory filter set;
     * similarity = `1 - distance`, clamped into [0, 1].
     */
    query(query: IVectorStoreQuery): Promise<IVectorStoreHit[]>;
}
/**
 * Parses the chunk metadata column, which arrives as a JSON string on some drivers.
 */
export declare function parseMetadata(value: unknown): any;
