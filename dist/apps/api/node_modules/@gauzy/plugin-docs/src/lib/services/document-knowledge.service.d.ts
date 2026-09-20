import { ID, IDocument } from '@gauzy/contracts';
import { BulkKnowledgeReindexDTO, ReindexDocumentKnowledgeDTO } from '../dto';
import { DocsAiService } from '../knowledge/ai/docs-ai.service';
import { DocumentIndexService } from '../knowledge/indexing/document-index.service';
import { DocsQueueService } from '../knowledge/queue/docs-queue.service';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentProcessingService } from './document-processing.service';
import { DocumentService } from './document.service';
/** Response of `GET /api/plugins/docs/knowledge/status` (§8.3). */
export interface IKnowledgeStatus {
    vectorCapable: boolean;
    embeddingProviderConfigured: boolean;
    embeddingModel: string;
}
/** Response of the bulk reindex sweep. */
export interface IBulkReindexResult {
    scope: 'model-drift' | 'all';
    dryRun: boolean;
    affected: number;
}
/**
 * Request-path knowledge lifecycle operations (§4.8 of the backend spec): import,
 * exclude, per-document and bulk re-index, and the capability status probe.
 */
export declare class DocumentKnowledgeService {
    private readonly documentService;
    private readonly processingService;
    private readonly documentIndexService;
    private readonly docsQueueService;
    private readonly docsAiService;
    private readonly typeOrmDocumentRepository;
    private readonly logger;
    constructor(documentService: DocumentService, processingService: DocumentProcessingService, documentIndexService: DocumentIndexService, docsQueueService: DocsQueueService, docsAiService: DocsAiService, typeOrmDocumentRepository: TypeOrmDocumentRepository);
    /**
     * `POST /documents/:id/knowledge/import` — `NONE`/`EXCLUDED`/`FAILED` → `QUEUED` +
     * enqueue from the right pipeline stage (`docs.chunk` when `extractedText` exists,
     * else `docs.extract`). Already `INDEXED`/`QUEUED`/`INDEXING` → no-op. FILE must be
     * `READY` (409 `DOCS_NOT_READY`); PAGE always eligible; FOLDER never indexable.
     */
    importToKnowledge(id: ID): Promise<IDocument>;
    /**
     * `POST /documents/:id/knowledge/exclude` — sets `EXCLUDED` and deletes the document's
     * chunks + index state transactionally (excluded content leaves the index physically).
     * Idempotent.
     */
    excludeFromKnowledge(id: ID): Promise<IDocument>;
    /**
     * `POST /documents/:id/knowledge/reindex` — re-runs `chunk → embed → index`.
     * `force: false` (default) keeps the `contentHash` short-circuit.
     */
    reindexDocument(id: ID, input?: ReindexDocumentKnowledgeDTO): Promise<IDocument>;
    /**
     * `POST /knowledge/reindex` — the bulk model-drift / full re-index sweep (§8.4).
     * Selects the caller's tenant/org `INDEXED` documents whose index state mismatches the
     * expected model (or all, for `scope: 'all'`) and enqueues low-priority `chunk` jobs.
     */
    bulkReindex(input?: BulkKnowledgeReindexDTO): Promise<IBulkReindexResult>;
    /**
     * `POST /documents/:id/summary/regenerate` — re-runs the classification stage (which
     * regenerates the AI summary) for a READY FILE document with extracted text.
     */
    regenerateSummary(id: ID): Promise<IDocument>;
    /**
     * `GET /knowledge/status` — deployment/index capability probe (§8.3).
     */
    getStatus(): Promise<IKnowledgeStatus>;
    /** FOLDER documents are never indexable (§2). */
    private assertIndexable;
    /** Request-path knowledge-status write with event emission. */
    private setKnowledgeStatus;
}
