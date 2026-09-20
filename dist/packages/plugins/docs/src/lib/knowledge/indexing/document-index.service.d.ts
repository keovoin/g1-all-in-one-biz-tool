import { ID } from '@gauzy/contracts';
import { Document } from '../../entities/document.entity';
import { TypeOrmDocumentChunkRepository } from '../../repositories/type-orm-document-chunk.repository';
import { TypeOrmDocumentIndexStateRepository } from '../../repositories/type-orm-document-index-state.repository';
import { TypeOrmDocumentRepository } from '../../repositories/type-orm-document.repository';
import { EmbeddingService } from '../embedding/embedding.service';
import { IDocsChunkJob, IDocsEmbedJob, IDocsIndexJob } from '../queue/docs-job.types';
import { IVectorStoreScope } from '../vector-store/vector-store.interface';
/** Chunk-stage result the worker branches on. */
export interface IChunkStageResult {
    outcome: 'chunked' | 'skipped-unchanged';
    contentHash: string;
}
/** Embed-stage result carried into the index job payload. */
export interface IEmbedStageResult {
    embeddingModel: string | null;
    embeddingDims: number | null;
}
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
export declare class DocumentIndexService {
    private readonly typeOrmDocumentRepository;
    private readonly typeOrmDocumentChunkRepository;
    private readonly typeOrmDocumentIndexStateRepository;
    private readonly embeddingService;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, typeOrmDocumentChunkRepository: TypeOrmDocumentChunkRepository, typeOrmDocumentIndexStateRepository: TypeOrmDocumentIndexStateRepository, embeddingService: EmbeddingService);
    /** SHA-256 hex digest of the normalized markdown that gets chunked. */
    contentHashOf(markdown: string): string;
    /**
     * The embedding model this deployment would index with right now: the configured model
     * when a provider resolves AND the active store accepts vectors, else the lexical
     * sentinel. Drives both the skip-if-unchanged check and the model-drift sweep.
     */
    expectedEmbeddingModel(tenantId: ID): Promise<string>;
    /**
     * `docs.chunk` stage: resolves the knowledge markdown, short-circuits on an unchanged
     * `contentHash` + embedding model, else transactionally replaces the chunk set.
     */
    runChunkStage(document: Document, job: IDocsChunkJob): Promise<IChunkStageResult>;
    /**
     * `docs.embed` stage: provider-resolved batched embedding written through the active
     * vector store. Lexical-only conditions (AI disabled, no provider, lexical store) skip
     * cleanly with `embeddingModel: null`.
     */
    runEmbedStage(document: Document, job: IDocsEmbedJob): Promise<IEmbedStageResult>;
    /**
     * `docs.index` stage: completeness verification, `document_index_state` upsert, and
     * the `INDEXED` flip.
     */
    runIndexStage(document: Document, job: IDocsIndexJob): Promise<void>;
    /**
     * Removes one document's knowledge projection (chunks + index state) in one
     * transaction — the exclude/reject cleanup. Idempotent.
     */
    removeKnowledgeProjection(scope: IVectorStoreScope, documentId: ID): Promise<void>;
    /**
     * Documents of one tenant/org whose index state mismatches the expected embedding
     * model (the §8.4 drift set). Includes lexical-only (`sentinel`) rows once a provider
     * appears, and vice versa.
     */
    findModelDriftDocumentIds(scope: IVectorStoreScope, expectedModel: string): Promise<ID[]>;
    /**
     * Worker-safe knowledge-status write (mirrors `DocumentProcessingService` semantics
     * without the request-path coupling).
     */
    private setKnowledgeStatus;
    /**
     * Merges keys into `document.metadata.indexing` (sqlite-aware serialization — `update`
     * bypasses the entity subscribers).
     */
    private mergeIndexingMetadata;
}
