import { ID, IDocumentIndexState } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Document } from './document.entity';
export declare class DocumentIndexState extends TenantOrganizationBaseEntity implements IDocumentIndexState {
    /**
     * Model id used at index time (e.g. the value of `GAUZY_DOCS_EMBEDDING_MODEL`).
     * Indexed so a model-flip sweep is one indexed scan.
     */
    embeddingModel: string;
    /**
     * Vector dimensionality at index time (1536 default).
     */
    embeddingDims: number;
    /**
     * Chunks written in the last successful index run.
     */
    chunkCount: number;
    /**
     * Last successful index completion.
     */
    lastIndexedAt: Date;
    /**
     * SHA-256 of the exact text that was chunked (`extractedText` or serialized page markdown).
     * The pipeline skips embed+index when unchanged.
     */
    contentHash: string;
    /**
     * The indexed document — exactly one bookkeeping row per document (upserted by the `index` job).
     */
    document?: Document;
    /**
     * The UUID of the indexed document.
     */
    documentId: ID;
}
