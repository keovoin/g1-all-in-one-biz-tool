"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPluginSettingValueDTO = exports.BulkUpdatePluginSettingsDTO = exports.PluginSettingQueryDTO = exports.UpdatePluginSettingDTO = exports.CreatePluginSettingDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
/**
 * Create Plugin Setting DTO
 */
class CreatePluginSettingDTO {
}
exports.CreatePluginSettingDTO = CreatePluginSettingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginSettingDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin Tenant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginSettingDTO.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Setting key' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginSettingDTO.prototype, "key", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Setting value' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CreatePluginSettingDTO.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is setting required' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginSettingDTO.prototype, "isRequired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is setting encrypted' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginSettingDTO.prototype, "isEncrypted", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Setting description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginSettingDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Setting order' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], CreatePluginSettingDTO.prototype, "order", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Validation rules' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CreatePluginSettingDTO.prototype, "validationRules", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSettingDataType, description: 'Data type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSettingDataType),
    tslib_1.__metadata("design:type", String)
], CreatePluginSettingDTO.prototype, "dataType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default value' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CreatePluginSettingDTO.prototype, "defaultValue", void 0);
/**
 * Update Plugin Setting DTO
 */
class UpdatePluginSettingDTO {
}
exports.UpdatePluginSettingDTO = UpdatePluginSettingDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Setting value' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginSettingDTO.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSettingDataType, description: 'Data type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSettingDataType),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSettingDTO.prototype, "dataType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is setting required' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginSettingDTO.prototype, "isRequired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Is setting encrypted' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdatePluginSettingDTO.prototype, "isEncrypted", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Default value' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginSettingDTO.prototype, "defaultValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Setting description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSettingDTO.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Setting order' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], UpdatePluginSettingDTO.prototype, "order", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Validation rules' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], UpdatePluginSettingDTO.prototype, "validationRules", void 0);
/**
 * Plugin Setting Query DTO
 */
class PluginSettingQueryDTO {
}
exports.PluginSettingQueryDTO = PluginSettingQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginSettingQueryDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin Tenant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginSettingQueryDTO.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Setting key' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSettingQueryDTO.prototype, "key", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Setting category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginSettingQueryDTO.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginSettingDataType, description: 'Data type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSettingDataType),
    tslib_1.__metadata("design:type", String)
], PluginSettingQueryDTO.prototype, "dataType", void 0);
/**
 * Bulk Update Plugin Settings DTO
 */
class BulkUpdatePluginSettingsDTO {
}
exports.BulkUpdatePluginSettingsDTO = BulkUpdatePluginSettingsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], BulkUpdatePluginSettingsDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin Tenant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], BulkUpdatePluginSettingsDTO.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        description: 'Array of setting updates',
        example: [{ key: 'api_key', value: 'new_value' }]
    }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Array)
], BulkUpdatePluginSettingsDTO.prototype, "settings", void 0);
/**
 * Set Plugin Setting Value DTO
 */
class SetPluginSettingValueDTO {
}
exports.SetPluginSettingValueDTO = SetPluginSettingValueDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], SetPluginSettingValueDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Setting key' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SetPluginSettingValueDTO.prototype, "key", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Setting value' }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Object)
], SetPluginSettingValueDTO.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin Tenant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], SetPluginSettingValueDTO.prototype, "pluginTenantId", void 0);
//# sourceMappingURL=plugin-setting.dto.js.map