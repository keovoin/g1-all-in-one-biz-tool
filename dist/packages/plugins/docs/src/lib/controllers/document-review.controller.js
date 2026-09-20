"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentReviewController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const update_extracted_text_command_1 = require("../commands/update-extracted-text.command");
const dto_1 = require("../dto");
const document_knowledge_service_1 = require("../services/document-knowledge.service");
const document_review_service_1 = require("../services/document-review.service");
const document_service_1 = require("../services/document.service");
/**
 * Review-workflow surface of the Documents plugin (§4.9 of the backend spec): the manual
 * review request, the approve/reject decisions (the human side of the AI review circuit
 * breaker), the extracted-text read/correction endpoints, and AI summary regeneration.
 */
let DocumentReviewController = class DocumentReviewController {
    constructor(commandBus, documentService, documentReviewService, documentKnowledgeService) {
        this.commandBus = commandBus;
        this.documentService = documentService;
        this.documentReviewService = documentReviewService;
        this.documentKnowledgeService = documentKnowledgeService;
    }
    /**
     * Manual review request: `reviewStatus → PENDING`, `reviewReason: 'manual'`
     * (machine-set reasons come from the pipeline). Already PENDING → 200 no-op.
     */
    async requestReview(id, input) {
        return this.documentReviewService.requestReview(id, input);
    }
    /**
     * Approves a PENDING review — an already-INDEXED document becomes retrievable
     * immediately (the circuit breaker opens; no re-index needed).
     */
    async approveReview(id, input) {
        return this.documentReviewService.approve(id, input);
    }
    /**
     * Rejects a PENDING review — the document stays stored but is excluded from AI
     * retrieval (`knowledgeStatus` forced to `EXCLUDED`).
     */
    async rejectReview(id, input) {
        return this.documentReviewService.reject(id, input);
    }
    /**
     * Re-runs the classification stage to regenerate the AI summary of a FILE document.
     */
    async regenerateSummary(id) {
        return this.documentKnowledgeService.regenerateSummary(id);
    }
    /**
     * The one endpoint that returns the full extracted markdown (review/correction UI).
     */
    async getExtractedText(id) {
        const document = await this.documentService.findOneScoped(id);
        return {
            extractedText: document.extractedText ?? null,
            extractedTextEdited: document.extractedTextEdited,
            status: document.status,
            statusMessage: document.statusMessage ?? null
        };
    }
    /**
     * Human correction of the extraction: stores the markdown, sets
     * `extractedTextEdited: true` (permanently protects it from pipeline overwrite),
     * forces `status: READY`, and re-enqueues from `docs.chunk` when the document is in
     * knowledge. FILE kind only (409 `DOCS_NOT_A_FILE`).
     */
    async updateExtractedText(id, input) {
        return this.commandBus.execute(new update_extracted_text_command_1.UpdateExtractedTextCommand(id, input));
    }
};
exports.DocumentReviewController = DocumentReviewController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Request a human review of a document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document is pending review.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/:id/review/request'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.RequestReviewDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentReviewController.prototype, "requestReview", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Approve a pending document review.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Review approved.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'The document is not pending review.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_REVIEW),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/:id/review/approve'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ApproveReviewDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentReviewController.prototype, "approveReview", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reject a pending document review.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Review rejected.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'The document is not pending review.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_REVIEW),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/:id/review/reject'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.RejectReviewDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentReviewController.prototype, "rejectReview", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Regenerate the AI summary of a document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Summary regeneration queued.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/:id/summary/regenerate'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentReviewController.prototype, "regenerateSummary", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Read the extracted text of a FILE document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Extracted text payload.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, common_1.Get)('/:id/extracted-text'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentReviewController.prototype, "getExtractedText", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Save a human-corrected extraction for a FILE document.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Extracted text saved.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Not a FILE document.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_UPDATE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Put)('/:id/extracted-text'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateExtractedTextDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentReviewController.prototype, "updateExtractedText", null);
exports.DocumentReviewController = DocumentReviewController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/documents'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        document_service_1.DocumentService,
        document_review_service_1.DocumentReviewService,
        document_knowledge_service_1.DocumentKnowledgeService])
], DocumentReviewController);
//# sourceMappingURL=document-review.controller.js.map