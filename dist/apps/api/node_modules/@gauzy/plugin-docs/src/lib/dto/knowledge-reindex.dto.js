"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkKnowledgeReindexDTO = exports.ReindexDocumentKnowledgeDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Body of `POST /api/plugins/docs/documents/:id/knowledge/reindex`.
 */
class ReindexDocumentKnowledgeDTO {
}
exports.ReindexDocumentKnowledgeDTO = ReindexDocumentKnowledgeDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ReindexDocumentKnowledgeDTO.prototype, "force", void 0);
/**
 * Body of the bulk `POST /api/plugins/docs/knowledge/reindex` sweep (§8.4).
 */
class BulkKnowledgeReindexDTO {
}
exports.BulkKnowledgeReindexDTO = BulkKnowledgeReindexDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['model-drift', 'all'], default: 'model-drift' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['model-drift', 'all']),
    tslib_1.__metadata("design:type", String)
], BulkKnowledgeReindexDTO.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], BulkKnowledgeReindexDTO.prototype, "dryRun", void 0);
//# sourceMappingURL=knowledge-reindex.dto.js.map