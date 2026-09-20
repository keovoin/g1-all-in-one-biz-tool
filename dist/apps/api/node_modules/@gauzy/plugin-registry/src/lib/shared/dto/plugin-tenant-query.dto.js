"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTenantQueryDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PluginTenantQueryDTO {
}
exports.PluginTenantQueryDTO = PluginTenantQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Plugin ID to filter by' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginTenantQueryDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Tenant ID to filter by' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginTenantQueryDTO.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Organization ID to filter by' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginTenantQueryDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Filter by enabled status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenantQueryDTO.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.PluginScope, description: 'Filter by scope' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PluginScope),
    tslib_1.__metadata("design:type", String)
], PluginTenantQueryDTO.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Filter by mandatory status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenantQueryDTO.prototype, "isMandatory", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Filter by data compliance status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenantQueryDTO.prototype, "isDataCompliant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Filter by approval status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenantQueryDTO.prototype, "isApproved", void 0);
//# sourceMappingURL=plugin-tenant-query.dto.js.map