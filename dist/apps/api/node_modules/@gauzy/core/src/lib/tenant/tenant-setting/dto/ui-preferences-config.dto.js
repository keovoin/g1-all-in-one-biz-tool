"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiPreferencesConfigDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
/**
 * Tenant-wide UI preferences — the validation DTO of `PUT /tenant-ui-preferences`.
 *
 * The values are plain (non-secret) tenant settings, so they need no `WrapSecrets` entry in
 * `TenantSettingGetHandler`; they surface in `GET /tenant-setting` like any other row.
 */
class UiPreferencesConfigDTO {
}
exports.UiPreferencesConfigDTO = UiPreferencesConfigDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PreferredUiEnum, enumName: 'PreferredUiEnum' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PreferredUiEnum),
    tslib_1.__metadata("design:type", String)
], UiPreferencesConfigDTO.prototype, "preferredUi", void 0);
//# sourceMappingURL=ui-preferences-config.dto.js.map