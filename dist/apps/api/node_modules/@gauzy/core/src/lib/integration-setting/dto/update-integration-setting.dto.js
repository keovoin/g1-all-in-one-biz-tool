"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIntegrationSettingDTO = void 0;
const tslib_1 = require("tslib");
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../core/dto");
/**
 *
 */
class UpdateIntegrationSettingDTO extends (0, mapped_types_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO) {
}
exports.UpdateIntegrationSettingDTO = UpdateIntegrationSettingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateIntegrationSettingDTO.prototype, "settingsValue", void 0);
//# sourceMappingURL=update-integration-setting.dto.js.map