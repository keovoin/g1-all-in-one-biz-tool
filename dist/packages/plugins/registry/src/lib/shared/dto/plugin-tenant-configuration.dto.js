"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTenantConfigurationDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PluginTenantConfigurationDTO {
}
exports.PluginTenantConfigurationDTO = PluginTenantConfigurationDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Plugin tenant ID'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginTenantConfigurationDTO.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Object,
        description: 'Configuration to merge/set'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], PluginTenantConfigurationDTO.prototype, "configuration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Object,
        description: 'Preferences to merge/set'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], PluginTenantConfigurationDTO.prototype, "preferences", void 0);
//# sourceMappingURL=plugin-tenant-configuration.dto.js.map