"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeDocumentCategoryDTO = exports.UpdateDocumentCategoryDTO = exports.CreateDocumentCategoryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
/**
 * Create payload for `POST /api/plugins/docs/categories`.
 * Names are unique per organization (case-insensitive); the slug is auto-derived when absent.
 */
class CreateDocumentCategoryDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.CreateDocumentCategoryDTO = CreateDocumentCategoryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    tslib_1.__metadata("design:type", String)
], CreateDocumentCategoryDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    tslib_1.__metadata("design:type", String)
], CreateDocumentCategoryDTO.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    tslib_1.__metadata("design:type", String)
], CreateDocumentCategoryDTO.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    tslib_1.__metadata("design:type", String)
], CreateDocumentCategoryDTO.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    tslib_1.__metadata("design:type", String)
], CreateDocumentCategoryDTO.prototype, "description", void 0);
/**
 * Update payload for `PUT /api/plugins/docs/categories/:id`.
 * `isSystem` rows: rename allowed, `slug` immutable (service-enforced).
 */
class UpdateDocumentCategoryDTO extends (0, swagger_1.PartialType)(CreateDocumentCategoryDTO) {
}
exports.UpdateDocumentCategoryDTO = UpdateDocumentCategoryDTO;
/**
 * Payload for `POST /api/plugins/docs/categories/:id/merge` — re-points all document
 * assignments to `targetId` (deduplicated), then soft-deletes the source.
 */
class MergeDocumentCategoryDTO {
}
exports.MergeDocumentCategoryDTO = MergeDocumentCategoryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], MergeDocumentCategoryDTO.prototype, "targetId", void 0);
//# sourceMappingURL=document-category.dto.js.map