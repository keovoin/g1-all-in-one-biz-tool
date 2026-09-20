"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSettingsDTO = exports.DocumentSettingsQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
/**
 * Query params of `GET`/`PUT /api/plugins/docs/settings`.
 *
 * `organizationId` used to be a raw `@Query()` string, which let any `DOCS_READ` holder name an
 * organization they do not belong to and read its settings. Extending a partial
 * `TenantOrganizationBaseDTO` reuses the platform's `@IsOrganizationBelongsToUser()` ownership
 * check; when omitted, the controller falls back to the requester's current organization.
 */
class DocumentSettingsQueryDTO extends (0, swagger_1.PartialType)(core_1.TenantOrganizationBaseDTO) {
}
exports.DocumentSettingsQueryDTO = DocumentSettingsQueryDTO;
/**
 * Org-defaults block accepted by `PUT /api/plugins/docs/settings` (partial update).
 * The read-only `capabilities` and `quota` blocks of the GET response are never writable
 * (`quotaBytes` below is the ONE writable quota field — the usage numbers are computed).
 */
class DocumentSettingsDTO {
}
exports.DocumentSettingsDTO = DocumentSettingsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], DocumentSettingsDTO.prototype, "importToKnowledgeDefault", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.DocumentVisibilityEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentVisibilityEnum),
    tslib_1.__metadata("design:type", String)
], DocumentSettingsDTO.prototype, "defaultVisibility", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], DocumentSettingsDTO.prototype, "autoClassify", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], DocumentSettingsDTO.prototype, "quotaBytes", void 0);
//# sourceMappingURL=document-settings.dto.js.map