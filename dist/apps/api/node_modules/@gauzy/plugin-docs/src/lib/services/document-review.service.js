"use strict";
var DocumentReviewService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentReviewService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const docs_constants_1 = require("../docs.constants");
const document_index_service_1 = require("../knowledge/indexing/document-index.service");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const document_service_1 = require("./document.service");
/**
 * The human-review workflow (§4.9 of the backend spec, §12 of the AI-knowledge spec).
 *
 * State machine: `NONE → PENDING → APPROVED | REJECTED` (re-reviewable). Approve makes an
 * already-`INDEXED` document retrievable immediately — the circuit-breaker filter is
 * dynamic, no re-index needed. Reject never deletes the document; it forces
 * `knowledgeStatus: EXCLUDED` and physically removes the knowledge projection.
 */
let DocumentReviewService = DocumentReviewService_1 = class DocumentReviewService {
    constructor(documentService, documentIndexService, typeOrmDocumentRepository) {
        this.documentService = documentService;
        this.documentIndexService = documentIndexService;
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.logger = new common_1.Logger(DocumentReviewService_1.name);
    }
    /**
     * `POST /documents/:id/review/request` — manual review request. Already PENDING →
     * 200 no-op (machine-set reasons come from the pipeline, never from this route).
     */
    async requestReview(id, input = {}) {
        const document = await this.documentService.findOneScoped(id);
        // A review request mutates the document's review state — read access is not enough.
        await this.documentService.assertCanWrite(document);
        if (document.reviewStatus === contracts_1.DocumentReviewStatusEnum.PENDING) {
            return document;
        }
        const previous = document.reviewStatus;
        await this.updateReview(document, {
            reviewStatus: contracts_1.DocumentReviewStatusEnum.PENDING,
            reviewReason: contracts_1.DocumentReviewReasonEnum.MANUAL,
            reviewedById: null,
            reviewedAt: null
        });
        if (input.reason) {
            await this.mergeReviewMetadata(document, { requestReason: input.reason.slice(0, 1000) });
        }
        // §8/§9.4 — whoever asked for the review is the person who needs to hear about its
        // outcome, so the request itself subscribes them to the document.
        this.documentService.subscribeRequesterToDocument(document, contracts_1.EntitySubscriptionTypeEnum.MANUAL);
        this.emit(document, previous, contracts_1.DocumentReviewStatusEnum.PENDING);
        return document;
    }
    /**
     * `POST /documents/:id/review/approve` — PENDING → APPROVED; stamps `reviewedById` +
     * `reviewedAt`. An `INDEXED`-pending-gate document becomes retrievable immediately.
     * Non-PENDING → 409 `DOCS_REVIEW_NOT_PENDING`.
     */
    async approve(id, input = {}) {
        const document = await this.requirePending(id);
        await this.updateReview(document, {
            reviewStatus: contracts_1.DocumentReviewStatusEnum.APPROVED,
            reviewedById: core_1.RequestContext.currentEmployeeId() ?? null,
            reviewedAt: new Date()
        });
        if (input.note) {
            await this.mergeReviewMetadata(document, { approveNote: input.note.slice(0, 1000) });
        }
        this.emit(document, contracts_1.DocumentReviewStatusEnum.PENDING, contracts_1.DocumentReviewStatusEnum.APPROVED);
        return document;
    }
    /**
     * `POST /documents/:id/review/reject` — PENDING → REJECTED; the document stays in the
     * hub but is excluded from AI retrieval: `knowledgeStatus` forced to `EXCLUDED` and the
     * knowledge projection removed. Re-reviewable via a new review request.
     */
    async reject(id, input = {}) {
        const document = await this.requirePending(id);
        await this.updateReview(document, {
            reviewStatus: contracts_1.DocumentReviewStatusEnum.REJECTED,
            reviewedById: core_1.RequestContext.currentEmployeeId() ?? null,
            reviewedAt: new Date()
        });
        if (input.reason) {
            await this.mergeReviewMetadata(document, { rejectReason: input.reason.slice(0, 1000) });
        }
        // Rejected content leaves the index physically (§4.9 / §12).
        if (document.knowledgeStatus !== contracts_1.DocumentKnowledgeStatusEnum.NONE) {
            await this.documentIndexService.removeKnowledgeProjection({ tenantId: document.tenantId, organizationId: document.organizationId }, document.id);
            const previousKnowledge = document.knowledgeStatus;
            await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED });
            document.knowledgeStatus = contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED;
            this.documentService.emitDocumentEvent(document, 'updated', {
                phase: 'knowledge',
                previous: previousKnowledge,
                next: contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED
            });
        }
        this.emit(document, contracts_1.DocumentReviewStatusEnum.PENDING, contracts_1.DocumentReviewStatusEnum.REJECTED);
        return document;
    }
    /** Loads the document and enforces the PENDING precondition. */
    async requirePending(id) {
        const document = await this.documentService.findOneScoped(id);
        if (document.reviewStatus !== contracts_1.DocumentReviewStatusEnum.PENDING) {
            throw new common_1.ConflictException({
                message: 'The document is not pending review',
                code: docs_constants_1.DOCS_REVIEW_NOT_PENDING
            });
        }
        return document;
    }
    /** Scoped review-column update mirrored onto the in-memory entity. */
    async updateReview(document, patch) {
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, patch);
        Object.assign(document, patch);
    }
    /** Merges keys into `metadata.review` (sqlite-aware — `update` bypasses subscribers). */
    async mergeReviewMetadata(document, patch) {
        const existing = (document.metadata && typeof document.metadata === 'object' ? document.metadata : {});
        const metadata = { ...existing, review: { ...(existing.review ?? {}), ...patch } };
        await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { metadata: (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? JSON.stringify(metadata) : metadata });
        document.metadata = metadata;
    }
    emit(document, previous, next) {
        this.documentService.emitDocumentEvent(document, 'updated', { phase: 'review', previous, next });
    }
};
exports.DocumentReviewService = DocumentReviewService;
exports.DocumentReviewService = DocumentReviewService = DocumentReviewService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_index_service_1.DocumentIndexService,
        type_orm_document_repository_1.TypeOrmDocumentRepository])
], DocumentReviewService);
//# sourceMappingURL=document-review.service.js.map