"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginTenantDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreatePluginTenantDTO {
}
exports.CreatePluginTenantDTO = CreatePluginTenantDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginTenantDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the plugin is enabled for this tenant', default: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginTenantDTO.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginScope, description: 'Scope of the plugin (USER, ORGANIZATION, TENANT)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginScope),
    tslib_1.__metadata("design:type", String)
], CreatePluginTenantDTO.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Tenant ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginTenantDTO.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Organization ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], CreatePluginTenantDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin can be installed automatically without user action',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginTenantDTO.prototype, "autoInstall", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin requires admin approval before installation',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginTenantDTO.prototype, "requiresApproval", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin is mandatory for all users in scope',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginTenantDTO.prototype, "isMandatory", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Maximum number of installations allowed (-1 for unlimited, null for no limit)',
        example: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxInstallations !== null && o.maxInstallations !== undefined),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(-1),
    tslib_1.__metadata("design:type", Number)
], CreatePluginTenantDTO.prototype, "maxInstallations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Maximum number of active users allowed (-1 for unlimited, null for no limit)',
        example: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.maxActiveUsers !== null && o.maxActiveUsers !== undefined),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(-1),
    tslib_1.__metadata("design:type", Number)
], CreatePluginTenantDTO.prototype, "maxActiveUsers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Object,
        description: 'Tenant-specific plugin configuration overrides',
        example: {
            branding: { logo: 'tenant-logo.png', theme: 'blue' },
            features: { advancedReporting: true },
            limits: { dailyUsage: 1000 }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], CreatePluginTenantDTO.prototype, "tenantConfiguration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Object,
        description: 'Plugin preferences and UI customizations for this tenant',
        example: {
            defaultSettings: { autoSave: true, notifications: false },
            uiCustomizations: { hideAdvancedOptions: true }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], CreatePluginTenantDTO.prototype, "preferences", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether plugin data handling complies with tenant data policies',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreatePluginTenantDTO.prototype, "isDataCompliant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'List of compliance certifications applicable to this tenant',
        example: ['SOC2', 'GDPR', 'HIPAA']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreatePluginTenantDTO.prototype, "complianceCertifications", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Array of role IDs explicitly allowed to access this plugin'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    tslib_1.__metadata("design:type", Array)
], CreatePluginTenantDTO.prototype, "allowedRoleIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Array of user IDs explicitly allowed to access this plugin'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    tslib_1.__metadata("design:type", Array)
], CreatePluginTenantDTO.prototype, "allowedUserIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Array of user IDs explicitly denied access to this plugin'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    tslib_1.__metadata("design:type", Array)
], CreatePluginTenantDTO.prototype, "deniedUserIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [Object],
        description: 'Array of roles explicitly allowed to access this plugin'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    tslib_1.__metadata("design:type", Array)
], CreatePluginTenantDTO.prototype, "allowedRoles", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [Object],
        description: 'Array of users explicitly allowed to access this plugin'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    tslib_1.__metadata("design:type", Array)
], CreatePluginTenantDTO.prototype, "allowedUsers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [Object],
        description: 'Array of users explicitly denied access to this plugin'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Object),
    tslib_1.__metadata("design:type", Array)
], CreatePluginTenantDTO.prototype, "deniedUsers", void 0);
//# sourceMappingURL=create-plugin-tenant.dto.js.map