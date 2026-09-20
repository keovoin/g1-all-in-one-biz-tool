"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentContentDTO = exports.UpdateDocumentContentMetadataDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
/**
 * The `metadata` keys a content save may write.
 *
 * 🛑 Deliberately a nested DTO with exactly one field rather than a free-form object: the
 * `document.metadata` column is a shared provenance dictionary with reserved namespaces
 * (`email`, `chat`, `migration`, `deletion`, `review`, `ai`), so an open `metadata` on the content
 * route would let an autosave clobber the AI classification or the migration provenance of the
 * row. The service merges this block into the stored value instead of replacing it.
 */
class UpdateDocumentContentMetadataDTO {
}
exports.UpdateDocumentContentMetadataDTO = UpdateDocumentContentMetadataDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], UpdateDocumentContentMetadataDTO.prototype, "schemaVersion", void 0);
/**
 * PAGE content save payload for `PUT /api/plugins/docs/documents/:id/content`.
 *
 * `contentJson` is canonical and is schema-validated server-side against the editor's node/mark
 * inventory (`08-permissions-security.md` §6.1) — an unknown node type, an unknown mark, a foreign
 * attribute key or a non-`http(s)`/`mailto`/`tel` link is a **400** (`DOCS_CONTENT_SCHEMA_INVALID`).
 * The client MAY send `contentHtml` (`editor.getHTML()`), which the server sanitizes before storing
 * the render cache; when it is omitted the server derives the cache from the validated JSON rather
 * than keeping the previous (now stale) HTML. A stale `expectedUpdatedAt` yields **409** with
 * `{ code: 'DOCS_CONTENT_CONFLICT', currentUpdatedAt }`; a locked document yields **423**.
 *
 * Extends a partial `TenantOrganizationBaseDTO` — the same shape as `DocumentScopeQueryDTO` on
 * the detail reads — for the editor's OPTIONAL selected-organization scope. Without it the save
 * is scoped by the token's `lastOrganizationId` (null for a non-employee user → 400, autosave
 * dies; stale when another organization of the tenant is open → 404). The inherited fields carry
 * the platform's `@IsOrganizationBelongsToUser()` ownership check, so a caller can never name an
 * organization they do not belong to — a plain `@IsUUID` here was a same-tenant
 * cross-organization write hole.
 */
class UpdateDocumentContentDTO extends (0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO) {
}
exports.UpdateDocumentContentDTO = UpdateDocumentContentDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], UpdateDocumentContentDTO.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object, description: 'Canonical TipTap JSON document' }),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", Object)
], UpdateDocumentContentDTO.prototype, "contentJson", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Render cache (editor.getHTML()), sanitized server-side' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateDocumentContentDTO.prototype, "contentHtml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, format: 'byte' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBase64)(),
    tslib_1.__metadata("design:type", String)
], UpdateDocumentContentDTO.prototype, "contentBinary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], UpdateDocumentContentDTO.prototype, "expectedUpdatedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateDocumentContentDTO.prototype, "forceSnapshot", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], UpdateDocumentContentDTO.prototype, "mentionEmployeeIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => UpdateDocumentContentMetadataDTO }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateDocumentContentMetadataDTO),
    tslib_1.__metadata("design:type", UpdateDocumentContentMetadataDTO)
], UpdateDocumentContentDTO.prototype, "metadata", void 0);
//# sourceMappingURL=update-document-content.dto.js.map