"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeSearchDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const docs_constants_1 = require("../docs.constants");
/**
 * Request body of `POST /api/plugins/docs/knowledge/search` (§9.1 of the AI-knowledge spec).
 */
class KnowledgeSearchDTO {
}
exports.KnowledgeSearchDTO = KnowledgeSearchDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'The search query (2–500 characters)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 500),
    tslib_1.__metadata("design:type", String)
], KnowledgeSearchDTO.prototype, "query", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, minimum: 1, maximum: docs_constants_1.DEFAULT_DOCS_RETRIEVAL_TOPK_MAX }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(docs_constants_1.DEFAULT_DOCS_RETRIEVAL_TOPK_MAX),
    tslib_1.__metadata("design:type", Number)
], KnowledgeSearchDTO.prototype, "topK", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(20),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], KnowledgeSearchDTO.prototype, "documentIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], KnowledgeSearchDTO.prototype, "categoryIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], KnowledgeSearchDTO.prototype, "tagIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: [contracts_1.DocumentKindEnum.FILE, contracts_1.DocumentKindEnum.PAGE] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsIn)([contracts_1.DocumentKindEnum.FILE, contracts_1.DocumentKindEnum.PAGE], { each: true }),
    tslib_1.__metadata("design:type", Array)
], KnowledgeSearchDTO.prototype, "kinds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.ValidateIf)((it) => it.entity !== undefined || it.entityId !== undefined),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    tslib_1.__metadata("design:type", String)
], KnowledgeSearchDTO.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => it.entity !== undefined || it.entityId !== undefined),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], KnowledgeSearchDTO.prototype, "entityId", void 0);
//# sourceMappingURL=knowledge-search.dto.js.map