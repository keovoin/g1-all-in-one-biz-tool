import { DocumentKnowledgeStatusEnum, ID, IDocument } from '@gauzy/contracts';
import { EventBus } from '@gauzy/core';
import { ReprocessDocumentDTO, UpdateExtractedTextDTO } from '../dto';
import { Document } from '../entities/document.entity';
import { ExtractionRegistryService } from '../knowledge/extraction';
import { DocsJobReason, IDocsExtractJob, IDocsJobBase } from '../knowledge/queue/docs-job.types';
import { DocsQueueService } from '../knowledge/queue/docs-queue.service';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentService } from './document.service';
/**
 * Pipeline orchestration facade: status transitions (`UPLOADED→PROCESSING→READY|FAILED`),
 * the `extractedTextEdited` guard (a human correction is never silently overwritten),
 * review-flag setting, `DocumentEvent` emission per transition, and the request-path
 * reprocess / extracted-text-correction flows.
 *
 * Worker-thread methods take an explicit tenant/organization snapshot and use plain
 * repository queries — `RequestContext` is NEVER consulted on queue threads.
 */
export declare class DocumentProcessingService {
    private readonly typeOrmDocumentRepository;
    private readonly documentService;
    private readonly docsQueueService;
    private readonly extractionRegistry;
    private readonly _eventBus;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, documentService: DocumentService, docsQueueService: DocsQueueService, extractionRegistry: ExtractionRegistryService, _eventBus: EventBus);
    /**
     * Loads a document by the explicit job snapshot (worker-safe — no `RequestContext`).
     * A soft-deleted or missing row returns null: the caller logs and completes the job.
     */
    loadSnapshot(documentId: ID, tenantId: ID, organizationId: ID): Promise<Document | null>;
    /**
     * Runs extraction for one FILE document (the `docs.extract` handler body).
     *
     * Honors the human-correction guard: when `extractedTextEdited` is set (and the job
     * does not carry `keepExtractedText`, which skips extraction entirely), the stored
     * text is preserved — a retry can never clobber a human correction.
     *
     * @param document The snapshot-loaded document row.
     * @param job The extract-job payload.
     * @returns True when extraction wrote (or preserved) usable text.
     */
    runExtraction(document: Document, job: IDocsExtractJob): Promise<boolean>;
    /**
     * Dead-letters an extract/classify-stage failure onto the document row itself:
     * `status: FAILED` + user-safe `statusMessage` (500 chars) + review flag
     * `PENDING / extraction-failed`. Only `DocsPermanentError` messages are user-facing.
     */
    markExtractionFailed(document: Document, error: unknown): Promise<void>;
    /**
     * Dead-letters a knowledge-stage (chunk/embed/index) failure: `knowledgeStatus: FAILED`
     * — `status` is NOT demoted (the document itself is fine; only its projection failed).
     */
    markKnowledgeFailed(document: Document, error: unknown): Promise<void>;
    /**
     * Sets the knowledge status with an event emission (worker-safe).
     */
    setKnowledgeStatus(document: Document, next: DocumentKnowledgeStatusEnum): Promise<void>;
    /**
     * Request-path: `POST /documents/:id/reprocess` — re-runs the pipeline from
     * `docs.extract` for a FILE document.
     *
     * @param id The document id (RBAC/visibility-scoped through `DocumentService`).
     * @param input `{ force?, ocr?, overwriteEdited? }`.
     * @returns The document after the enqueue.
     */
    reprocess(id: ID, input: ReprocessDocumentDTO): Promise<IDocument>;
    /**
     * Request-path: `PUT /documents/:id/extracted-text` — the human correction flow.
     * Stores the text, sets `extractedTextEdited: true` (permanent pipeline-overwrite
     * protection), forces `status: READY`, clears `statusMessage` and `aiConfidence`,
     * clears an `extraction-failed` PENDING review state, and re-enqueues from
     * `docs.chunk` (`reason: 'extracted-text-edited'`) when the document is in knowledge.
     */
    updateExtractedText(id: ID, input: UpdateExtractedTextDTO): Promise<IDocument>;
    /**
     * Enqueues `docs.extract` for a document with the standard tenant snapshot.
     */
    enqueueExtract(document: IDocument, reason: DocsJobReason, extras?: Partial<IDocsExtractJob>, options?: Record<string, unknown>): Promise<boolean>;
    /**
     * Builds the standard `IDocsJobBase` snapshot for a document.
     */
    snapshotOf(document: IDocument, reason: DocsJobReason): IDocsJobBase;
    /**
     * Worker-safe status transition + event emission.
     */
    private transition;
    /**
     * Merges the extraction result metadata under `metadata.extraction`.
     */
    private mergeExtractionMetadata;
    /**
     * Best-effort `DocumentEvent` emission — a failure logs and never rolls back the
     * primary mutation. On queue threads the request context is simply absent.
     */
    private emitEvent;
}
