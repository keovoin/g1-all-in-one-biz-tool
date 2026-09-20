"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSetting = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_category_entity_1 = require("./plugin-category.entity");
const plugin_tenant_entity_1 = require("./plugin-tenant.entity");
const plugin_entity_1 = require("./plugin.entity");
let PluginSetting = class PluginSetting extends core_1.TenantOrganizationBaseEntity {
};
exports.PluginSetting = PluginSetting;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Setting key/name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Setting key is required' }),
    (0, class_validator_1.IsString)({ message: 'Setting key must be a string' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "key", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Setting value string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Setting value is required' }),
    (0, core_1.MultiORMColumn)({ type: 'text' }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the setting is required' }),
    (0, class_validator_1.IsBoolean)({ message: 'isRequired must be a boolean' }),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSetting.prototype, "isRequired", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the setting is encrypted/sensitive' }),
    (0, class_validator_1.IsBoolean)({ message: 'isEncrypted must be a boolean' }),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSetting.prototype, "isEncrypted", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Setting description/help text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Display order for UI' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Order must be a number' }),
    (0, core_1.MultiORMColumn)({ type: 'int', nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PluginSetting.prototype, "order", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Validation rules (JSON string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Validation rules must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "validationRules", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginSettingDataType, description: 'Data type of the setting' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSettingDataType),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', enum: contracts_1.PluginSettingDataType, default: contracts_1.PluginSettingDataType.STRING }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "dataType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Default value for the setting' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Default value must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "defaultValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((setting) => setting.plugin),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'uuid', relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => plugin_entity_1.Plugin, description: 'Plugin' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_entity_1.Plugin, (plugin) => plugin.settings, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSetting.prototype, "plugin", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin tenant ID for tenant-specific settings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
    (0, typeorm_1.RelationId)((setting) => setting.pluginTenant),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => plugin_tenant_entity_1.PluginTenant, description: 'Plugin tenant' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_tenant_entity_1.PluginTenant, (tenant) => tenant.settings, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSetting.prototype, "pluginTenant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plugin category ID for default category settings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
    (0, typeorm_1.RelationId)((setting) => setting.category),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => plugin_category_entity_1.PluginCategory, description: 'Plugin category' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_category_entity_1.PluginCategory, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSetting.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => core_1.User, description: 'User who last updated this setting' }),
    (0, core_1.MultiORMManyToOne)(() => core_1.User, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSetting.prototype, "updatedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'ID of the user who last updated this setting' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((setting) => setting.updatedBy),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginSetting.prototype, "updatedById", void 0);
exports.PluginSetting = PluginSetting = tslib_1.__decorate([
    (0, typeorm_1.Index)(['pluginId', 'key', 'pluginTenantId'], { unique: true }),
    (0, core_1.MultiORMEntity)('plugin_settings')
], PluginSetting);
//# sourceMappingURL=plugin-setting.entity.js.map