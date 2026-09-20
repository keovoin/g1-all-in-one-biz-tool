import { ID, IDocumentChunk, IDocumentChunkMetadata } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Document } from './document.entity';
export declare class DocumentChunk extends TenantOrganizationBaseEntity implements IDocumentChunk {
    /**
     * 0-based position within the document.
     */
    chunkIndex: number;
    /**
     * Chunk text (~512-token heading-aware windows, 64-token overlap).
     */
    content: string;
    /**
     * Embedding vector. Declared `simple-json` at the entity level (a plain text column) so
     * schema tooling, SQLite unit tests, and MySQL installs stay ignorant of pgvector; the
     * PostgreSQL migration converts the column to `vector(1536)` and the vector write path
     * bypasses the ORM entirely. `NULL` until embedded.
     */
    embedding?: number[];
    /**
     * Token estimate for budget math.
     */
    tokenCount?: number;
    /**
     * Citation locators: `{ headingPath, page?, sheet?, charRange? }`.
     * (De)serialized on the SQLite path by the owning service — chunk content never rides an
     * entity serialization to the client, so no load-time subscriber exists.
     */
    metadata?: IDocumentChunkMetadata;
    /**
     * The chunked document. Deliberately no inverse navigation on `Document` — chunk content
     * must never ride an entity serialization to the client.
     */
    document?: Document;
    /**
     * The UUID of the chunked document.
     */
    documentId: ID;
}
