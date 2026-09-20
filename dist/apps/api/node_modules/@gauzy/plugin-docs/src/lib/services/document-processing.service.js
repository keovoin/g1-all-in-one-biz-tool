"use strict";
var DocumentProcessingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const docs_constants_1 = require("../docs.constants");
const document_event_1 = require("../events/document.event");
const errors_1 = require("../knowledge/errors");
const extraction_1 = require("../knowledge/extraction");
const constants_1 = require("../knowledge/queue/constants");
const docs_queue_service_1 = require("../knowledge/queue/docs-queue.service");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const document_service_1 = require("./document.service");
/**
 * Pipeline orchestration facade: status transitions (`UPLOADED→PROCESSING→READY|FAILED`),
 * the `extractedTextEdited` guard (a human correction is never silently overwritten),
 * review-flag setting, `DocumentEvent` emission per transition, and the request-path
 * reprocess / extracted-text-correction flows.
 *
 * Worker-thread methods take an explicit tenant/organization snapshot and use plain
 * repository queries — `RequestContext` is NEVER consulted on queue threads.
 */
let DocumentProcessingService = DocumentProcessingService_1 = class DocumentProcessingService {
    constructor(typeOrmDocumentRepository, documentService, docsQueueService, extractionRegistry, _eventBus) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.documentService = documentService;
        this.docsQueueService = docsQueueService;
        this.extractionRegistry = extractionRegistry;
        this._eventBus = _eventBus;
        this.logger = new common_1.Logger(DocumentProcessingService_1.name);
    }
    /**
     * Loads a document by the explicit job snapshot (worker-safe — no `RequestContext`).
     * A soft-deleted or missing row returns null: the caller logs and completes the job.
     */
    async loadSnapshot(documentId, tenantId, organizationId) {
        return this.typeOrmDocumentRepository.findOne({
            where: { id: documentId, tenantId, organizationId }
        });
    }
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
    async runExtraction(document, job) {
        const config = (0, docs_config_1.getDocsConfig)();
        // keepExtractedText / edited guard — preserve the stored text, skip the extractor.
        if (job.keepExtractedText || document.extractedTextEdited) {
            this.logger.log(`Extraction skipped for document ${document.id} (keepExtractedText=${!!job.keepExtractedText}, edited=${document.extractedTextEdited})`);
            await this.transition(document, {
                status: contracts_1.DocumentStatusEnum.READY,
                statusMessage: null
            });
            return Boolean(document.extractedText);
        }
        if (!document.storageKey) {
            throw new errors_1.DocsPermanentError('The document has no stored file to extract.');
        }
        await this.transition(document, { status: contracts_1.DocumentStatusEnum.PROCESSING });
        // Load the blob through the provider recorded on the row.
        const provider = new core_1.FileStorage().getProvider(document.storageProvider);
        const buffer = await provider.getFile(document.storageKey);
        const result = await this.extractionRegistry.extract(buffer, {
            filename: document.originalFilename ?? document.name,
            mimeType: document.mimeType,
            maxChars: config.maxExtractedChars,
            forceOcr: job.forceOcr,
            // The OCR path resolves provider credentials from these. They come off the JOB,
            // never `RequestContext` — extraction runs on queue and background threads.
            tenantId: job.tenantId ?? document.tenantId,
            organizationId: job.organizationId ?? document.organizationId
        });
        const metadata = this.mergeExtractionMetadata(document, result);
        const patch = {
            extractedText: result.markdown,
            status: contracts_1.DocumentStatusEnum.READY,
            statusMessage: null,
            // `.update()` bypasses entity subscribers, so the sqlite text-column
            // serialization the DocumentSubscriber normally performs happens here.
            metadata: ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? JSON.stringify(metadata) : metadata)
        };
        // OCR-derived text is a transcription, not a parse: it can silently drop or garble
        // content no downstream stage can detect. So it enters the review circuit breaker on
        // arrival — indexed and searchable, but withheld from AI retrieval until a human
        // approves it. The document still continues the normal chain from here.
        if (result.metadata?.ocr) {
            patch.reviewStatus = contracts_1.DocumentReviewStatusEnum.PENDING;
            patch.reviewReason = contracts_1.DocumentReviewReasonEnum.LOW_CONFIDENCE;
        }
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, patch);
        document.extractedText = result.markdown;
        document.status = contracts_1.DocumentStatusEnum.READY;
        document.metadata = metadata;
        if (result.metadata?.ocr) {
            document.reviewStatus = contracts_1.DocumentReviewStatusEnum.PENDING;
            document.reviewReason = contracts_1.DocumentReviewReasonEnum.LOW_CONFIDENCE;
            this.logger.log(`Extraction for document ${document.id} came from OCR ` +
                `(${result.metadata.ocr.pagesTranscribed}/${result.metadata.ocr.pageCount} pages via ` +
                `${result.metadata.ocr.providerId}) — flagged for review.`);
        }
        this.emitEvent(document, 'updated', {
            phase: 'status',
            previous: contracts_1.DocumentStatusEnum.PROCESSING,
            next: contracts_1.DocumentStatusEnum.READY,
            actor: 'system'
        });
        return true;
    }
    /**
     * Dead-letters an extract/classify-stage failure onto the document row itself:
     * `status: FAILED` + user-safe `statusMessage` (500 chars) + review flag
     * `PENDING / extraction-failed`. Only `DocsPermanentError` messages are user-facing.
     */
    async markExtractionFailed(document, error) {
        const message = error instanceof errors_1.DocsPermanentError
            ? error.message
            : 'An unexpected error occurred while processing the document.';
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, {
            status: contracts_1.DocumentStatusEnum.FAILED,
            statusMessage: message.slice(0, 500),
            reviewStatus: contracts_1.DocumentReviewStatusEnum.PENDING,
            reviewReason: contracts_1.DocumentReviewReasonEnum.EXTRACTION_FAILED
        });
        document.status = contracts_1.DocumentStatusEnum.FAILED;
        this.emitEvent(document, 'updated', {
            phase: 'status',
            previous: contracts_1.DocumentStatusEnum.PROCESSING,
            next: contracts_1.DocumentStatusEnum.FAILED,
            actor: 'system'
        });
    }
    /**
     * Dead-letters a knowledge-stage (chunk/embed/index) failure: `knowledgeStatus: FAILED`
     * — `status` is NOT demoted (the document itself is fine; only its projection failed).
     */
    async markKnowledgeFailed(document, error) {
        const message = error instanceof errors_1.DocsPermanentError
            ? error.message
            : 'An unexpected error occurred while indexing the document.';
        const previous = document.knowledgeStatus;
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, {
            knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.FAILED,
            statusMessage: message.slice(0, 500)
        });
        document.knowledgeStatus = contracts_1.DocumentKnowledgeStatusEnum.FAILED;
        this.emitEvent(document, 'updated', {
            phase: 'knowledge',
            previous,
            next: contracts_1.DocumentKnowledgeStatusEnum.FAILED,
            actor: 'system'
        });
    }
    /**
     * Sets the knowledge status with an event emission (worker-safe).
     */
    async setKnowledgeStatus(document, next) {
        const previous = document.knowledgeStatus;
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { knowledgeStatus: next });
        document.knowledgeStatus = next;
        this.emitEvent(document, 'updated', { phase: 'knowledge', previous, next, actor: 'system' });
    }
    /**
     * Request-path: `POST /documents/:id/reprocess` — re-runs the pipeline from
     * `docs.extract` for a FILE document.
     *
     * @param id The document id (RBAC/visibility-scoped through `DocumentService`).
     * @param input `{ force?, ocr?, overwriteEdited? }`.
     * @returns The document after the enqueue.
     */
    async reprocess(id, input) {
        const document = await this.documentService.findOneScoped(id);
        await this.documentService.assertCanWrite(document);
        if (document.kind !== contracts_1.DocumentKindEnum.FILE) {
            throw new common_1.ConflictException({
                message: 'Only FILE documents can be reprocessed',
                code: docs_constants_1.DOCS_NOT_A_FILE
            });
        }
        // The clobber guard: a human correction is never silently overwritten.
        if (document.extractedTextEdited && !input.overwriteEdited) {
            throw new common_1.ConflictException({
                message: 'The extracted text was edited by a human — pass overwriteEdited to re-extract',
                code: docs_constants_1.DOCS_EXTRACTED_TEXT_EDITED
            });
        }
        if (document.extractedTextEdited && input.overwriteEdited) {
            await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { extractedTextEdited: false });
            document.extractedTextEdited = false;
        }
        await this.enqueueExtract(document, 'reindex', { keepExtractedText: false, forceOcr: input.ocr === true }, 
        // A user-triggered reprocess must always run — a unique suffix bypasses the
        // deterministic-id coalescing against a retained completed job.
        { jobId: `docs:extract:${document.id}:${Date.now()}` });
        return document;
    }
    /**
     * Request-path: `PUT /documents/:id/extracted-text` — the human correction flow.
     * Stores the text, sets `extractedTextEdited: true` (permanent pipeline-overwrite
     * protection), forces `status: READY`, clears `statusMessage` and `aiConfidence`,
     * clears an `extraction-failed` PENDING review state, and re-enqueues from
     * `docs.chunk` (`reason: 'extracted-text-edited'`) when the document is in knowledge.
     */
    async updateExtractedText(id, input) {
        const document = await this.documentService.findOneScoped(id);
        await this.documentService.assertCanWrite(document);
        if (document.kind !== contracts_1.DocumentKindEnum.FILE) {
            throw new common_1.ConflictException({
                message: 'Extracted text applies to FILE documents only',
                code: docs_constants_1.DOCS_NOT_A_FILE
            });
        }
        const previousStatus = document.status;
        const patch = {
            extractedText: input.extractedText,
            extractedTextEdited: true,
            status: contracts_1.DocumentStatusEnum.READY,
            statusMessage: null,
            aiConfidence: null
        };
        if (document.reviewStatus === contracts_1.DocumentReviewStatusEnum.PENDING &&
            document.reviewReason === contracts_1.DocumentReviewReasonEnum.EXTRACTION_FAILED) {
            patch.reviewStatus = contracts_1.DocumentReviewStatusEnum.NONE;
            patch.reviewReason = null;
        }
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, patch);
        Object.assign(document, patch);
        this.emitEvent(document, 'updated', {
            phase: 'status',
            previous: previousStatus,
            next: contracts_1.DocumentStatusEnum.READY
        });
        // Entering at the chunk stage never runs extract/classify — the correction
        // survives by construction.
        if (document.knowledgeStatus !== contracts_1.DocumentKnowledgeStatusEnum.NONE &&
            document.knowledgeStatus !== contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED) {
            await this.docsQueueService.enqueue(constants_1.DOCS_JOB_CHUNK, this.snapshotOf(document, 'extracted-text-edited'));
        }
        return document;
    }
    /**
     * Enqueues `docs.extract` for a document with the standard tenant snapshot.
     */
    async enqueueExtract(document, reason, extras = {}, options = {}) {
        const payload = { ...this.snapshotOf(document, reason), ...extras };
        return this.docsQueueService.enqueue(constants_1.DOCS_JOB_EXTRACT, payload, options);
    }
    /**
     * Builds the standard `IDocsJobBase` snapshot for a document.
     */
    snapshotOf(document, reason) {
        let initiatedByUserId;
        let correlationId;
        try {
            initiatedByUserId = core_1.RequestContext.currentUserId() ?? undefined;
            correlationId = core_1.RequestContext.currentCorrelationId() ?? undefined;
        }
        catch {
            initiatedByUserId = undefined; // queue threads have no request context
            correlationId = undefined;
        }
        return {
            documentId: document.id,
            tenantId: document.tenantId,
            organizationId: document.organizationId,
            reason,
            initiatedByUserId,
            correlationId
        };
    }
    /**
     * Worker-safe status transition + event emission.
     */
    async transition(document, patch) {
        const previous = document.status;
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, patch);
        document.status = patch.status;
        this.emitEvent(document, 'updated', { phase: 'status', previous, next: patch.status, actor: 'system' });
    }
    /**
     * Merges the extraction result metadata under `metadata.extraction`.
     */
    mergeExtractionMetadata(document, result) {
        const existing = (document.metadata && typeof document.metadata === 'object' ? document.metadata : {});
        return {
            ...existing,
            extraction: {
                pageCount: result.metadata?.pageCount,
                truncated: result.metadata?.truncated ?? false,
                warnings: result.metadata?.warnings,
                wordCount: result.metadata?.wordCount,
                // Present ONLY on OCR-derived text — its presence is the provenance flag the
                // review queue and the detail panel read to say "transcribed, not parsed".
                ocr: result.metadata?.ocr,
                extractedAt: new Date().toISOString()
            }
        };
    }
    /**
     * Best-effort `DocumentEvent` emission — a failure logs and never rolls back the
     * primary mutation. On queue threads the request context is simply absent.
     */
    emitEvent(document, type, context) {
        try {
            const ctx = core_1.RequestContext.currentRequestContext();
            // `EventBus.publish` is `async`, so the catch below can only ever see a
            // synchronous throw (the context read, the event construction) — a rejected
            // publish would sail straight past it as an unhandled rejection. Emission is
            // best-effort by contract, so the promise is terminated on its own channel.
            this._eventBus
                .publish(new document_event_1.DocumentEvent(ctx, document, type, context))
                .catch((error) => this.logger.warn(`Failed to publish DocumentEvent (${type}): ${error.message}`));
        }
        catch (error) {
            this.logger.warn(`Failed to publish DocumentEvent (${type}): ${error.message}`);
        }
    }
};
exports.DocumentProcessingService = DocumentProcessingService;
exports.DocumentProcessingService = DocumentProcessingService = DocumentProcessingService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        document_service_1.DocumentService,
        docs_queue_service_1.DocsQueueService,
        extraction_1.ExtractionRegistryService,
        core_1.EventBus])
], DocumentProcessingService);
//# sourceMappingURL=document-processing.service.js.map