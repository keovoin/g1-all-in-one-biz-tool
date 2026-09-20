"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentsQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
/**
 * Normalizes an array query param accepted either as repeated params or as a CSV string.
 */
const parseArrayParam = ({ value }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value;
    }
    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};
/**
 * Normalizes a boolean query param (`'true'`/`'false'`).
 */
const parseBooleanParam = ({ value }) => value === undefined || value === null || value === ''
    ? undefined
    : value === true || ['true', '1', 'yes'].includes(String(value).toLowerCase());
/**
 * The complete filter set for `GET /api/plugins/docs/documents` (+ `/count` and `/facets`).
 * All params optional; array params accepted as repeated params or CSV.
 */
class GetDocumentsQueryDTO extends core_1.BaseQueryDTO {
}
exports.GetDocumentsQueryDTO = GetDocumentsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: contracts_1.DocumentKindEnum, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseArrayParam),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentKindEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetDocumentsQueryDTO.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: contracts_1.DocumentStatusEnum, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseArrayParam),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentStatusEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetDocumentsQueryDTO.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: contracts_1.DocumentKnowledgeStatusEnum, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseArrayParam),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentKnowledgeStatusEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetDocumentsQueryDTO.prototype, "knowledgeStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: contracts_1.DocumentReviewStatusEnum, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseArrayParam),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentReviewStatusEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetDocumentsQueryDTO.prototype, "reviewStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseBooleanParam),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], GetDocumentsQueryDTO.prototype, "needsReview", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, enum: contracts_1.DocumentSourceEnum, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseArrayParam),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentSourceEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetDocumentsQueryDTO.prototype, "source", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseArrayParam),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetDocumentsQueryDTO.prototype, "categoryIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseArrayParam),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetDocumentsQueryDTO.prototype, "tagIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.DocumentVisibilityEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentVisibilityEnum),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "visibility", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: ['exclude', 'include', 'only'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['exclude', 'include', 'only']),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "archived", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(parseBooleanParam),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], GetDocumentsQueryDTO.prototype, "searchable", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "createdAtFrom", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "createdAtTo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "updatedAtFrom", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "updatedAtTo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: "Parent id or 'root'" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((it) => it.parentId !== 'root'),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(256),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "q", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: ['name', 'content'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['name', 'content']),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "searchIn", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: ['name', 'updatedAt', 'createdAt', 'size', 'kind'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['name', 'updatedAt', 'createdAt', 'size', 'kind']),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "sort", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    tslib_1.__metadata("design:type", String)
], GetDocumentsQueryDTO.prototype, "sortOrder", void 0);
//# sourceMappingURL=get-documents-query.dto.js.map