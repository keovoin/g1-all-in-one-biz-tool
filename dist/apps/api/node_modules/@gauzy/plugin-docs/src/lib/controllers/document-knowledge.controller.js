"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentKnowledgeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const docs_config_1 = require("../docs.config");
const dto_1 = require("../dto");
const retrieval_service_1 = require("../knowledge/retrieval/retrieval.service");
const document_knowledge_service_1 = require("../services/document-knowledge.service");
/**
 * Knowledge operations of the Documents plugin (§4.8 of the backend spec): hybrid
 * retrieval, per-document import/exclude/reindex, the bulk model-drift sweep, and the
 * deployment capability probe.
 */
let DocumentKnowledgeController = class DocumentKnowledgeController {
    constructor(knowledgeSearchService, knowledgeService) {
        this.knowledgeSearchService = knowledgeSearchService;
        this.knowledgeService = knowledgeService;
    }
    /**
     * Hybrid lexical + vector retrieval with RRF fusion. Zero hits is HTTP 200 with an
     * empty, well-formed envelope — never an error (degradation ladder §10).
     */
    async search(input) {
        return this.knowledgeSearchService.search(input);
    }
    /**
     * Bulk model-drift / full re-index sweep (§8.4 of the AI-knowledge spec).
     */
    async bulkReindex(input) {
        return this.knowledgeService.bulkReindex(input);
    }
    /**
     * Deployment/index capability probe: `{ vectorCapable, embeddingProviderConfigured,
     * embeddingModel }` — no counts payload.
     */
    async status() {
        return this.knowledgeService.getStatus();
    }
    /**
     * Imports one document into AI knowledge (explicit choice — never a side effect).
     */
    async importToKnowledge(id) {
        return this.knowledgeService.importToKnowledge(id);
    }
    /**
     * Excludes one document from AI knowledge — chunks and index state are removed
     * physically in the same transaction. Idempotent.
     */
    async excludeFromKnowledge(id) {
        return this.knowledgeService.excludeFromKnowledge(id);
    }
    /**
     * Re-runs `chunk → embed → index` for one document. `force: false` (default) keeps the
     * `contentHash` skip-if-unchanged short-circuit.
     */
    async reindexDocument(id, input) {
        return this.knowledgeService.reindexDocument(id, input);
    }
};
exports.DocumentKnowledgeController = DocumentKnowledgeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Search the organization knowledge (hybrid lexical + vector, RRF).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Ranked chunk hits with citation locators.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true })
    // Every query fans out to a provider query-embedding call (`08-permissions-security.md` §9).
    ,
    (0, throttler_1.Throttle)((0, docs_config_1.docsRateLimit)((0, docs_config_1.getDocsConfig)().searchRateLimit)),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/knowledge/search'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.KnowledgeSearchDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentKnowledgeController.prototype, "search", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Bulk re-index the knowledge (model-drift or all).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Affected-document count (enqueued unless dryRun).' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_AI_IMPORT),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true })
    // One request can enqueue the whole organization's corpus (§9).
    ,
    (0, throttler_1.Throttle)((0, docs_config_1.docsRateLimit)((0, docs_config_1.getDocsConfig)().adminOpsRateLimit)),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/knowledge/reindex'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.BulkKnowledgeReindexDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentKnowledgeController.prototype, "bulkReindex", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Knowledge capability status.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Capability probe payload.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, common_1.Get)('/knowledge/status'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentKnowledgeController.prototype, "status", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Import a document into AI knowledge.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document queued (or already in knowledge).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Not indexable / not READY.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_AI_IMPORT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/documents/:id/knowledge/import'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentKnowledgeController.prototype, "importToKnowledge", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Exclude a document from AI knowledge.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Document excluded.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_AI_IMPORT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/documents/:id/knowledge/exclude'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentKnowledgeController.prototype, "excludeFromKnowledge", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Re-index one document into AI knowledge.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Re-index queued.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_AI_IMPORT),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true })
    // Re-chunk + re-embed of a whole document (§9).
    ,
    (0, throttler_1.Throttle)((0, docs_config_1.docsRateLimit)((0, docs_config_1.getDocsConfig)().adminOpsRateLimit)),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('/documents/:id/knowledge/reindex'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.ReindexDocumentKnowledgeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentKnowledgeController.prototype, "reindexDocument", null);
exports.DocumentKnowledgeController = DocumentKnowledgeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs'),
    tslib_1.__metadata("design:paramtypes", [retrieval_service_1.DocumentKnowledgeSearchService,
        document_knowledge_service_1.DocumentKnowledgeService])
], DocumentKnowledgeController);
//# sourceMappingURL=document-knowledge.controller.js.map