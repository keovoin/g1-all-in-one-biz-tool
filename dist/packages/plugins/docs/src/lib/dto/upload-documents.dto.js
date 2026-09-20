"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocumentsDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
/**
 * Normalizes a multipart text part into a boolean (`'true'`/`'1'` → true).
 */
const toBoolean = ({ value }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    return ['true', '1', 'yes'].includes(String(value).toLowerCase());
};
/**
 * Normalizes a multipart text part into a string array (repeated parts or CSV).
 */
const toArray = ({ value }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value;
    }
    return String(value)
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
};
/**
 * Form fields accompanying the files of `POST /api/plugins/docs/documents/upload`
 * (multipart text parts — arrays accepted as repeated parts or CSV).
 *
 * `source` accepts only `UPLOAD` (default), `CHAT`, and `EDITOR` from this endpoint;
 * `EMAIL`, `INTEGRATION`, `SYSTEM`, `IMPORT` are reserved for server-side ingestion
 * paths and rejected with 400 `DOCS_SOURCE_RESERVED` (enforced in the service).
 */
class UploadDocumentsDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.UploadDocumentsDTO = UploadDocumentsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], UploadDocumentsDTO.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.DocumentVisibilityEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentVisibilityEnum),
    tslib_1.__metadata("design:type", String)
], UploadDocumentsDTO.prototype, "visibility", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(toArray),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], UploadDocumentsDTO.prototype, "categoryIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(toArray),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], UploadDocumentsDTO.prototype, "tagIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(toBoolean),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UploadDocumentsDTO.prototype, "importToKnowledge", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(toBoolean),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UploadDocumentsDTO.prototype, "classifyWithAi", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.DocumentSourceEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentSourceEnum),
    tslib_1.__metadata("design:type", String)
], UploadDocumentsDTO.prototype, "source", void 0);
//# sourceMappingURL=upload-documents.dto.js.map