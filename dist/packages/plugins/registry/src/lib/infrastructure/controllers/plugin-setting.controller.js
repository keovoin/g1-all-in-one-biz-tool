"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSettingController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const domain_1 = require("../../domain");
const shared_1 = require("../../shared");
let PluginSettingController = class PluginSettingController {
    constructor(commandBus, queryBus, pluginSettingService) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.pluginSettingService = pluginSettingService;
    }
    async create(pluginId, createDto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.CreatePluginSettingCommand({ ...createDto, pluginId }, tenantId, organizationId, userId));
    }
    async findAll(pluginId, query) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        // Handle category filter
        if (query.category) {
            return await this.queryBus.execute(new application_1.GetPluginSettingsByCategoryQuery(pluginId, query.category, query.pluginTenantId, ['plugin', 'pluginTenant'], tenantId, organizationId));
        }
        // Handle key filter
        if (query.key) {
            const setting = await this.queryBus.execute(new application_1.GetPluginSettingsByKeyQuery(pluginId, query.key, query.pluginTenantId, ['plugin', 'pluginTenant'], tenantId, organizationId));
            return setting ? [setting] : [];
        }
        // Default: get all settings
        return await this.queryBus.execute(new application_1.GetPluginSettingsByPluginIdQuery(pluginId, ['plugin', 'pluginTenant'], tenantId, organizationId));
    }
    async findOne(pluginId, id) {
        const tenantId = core_1.RequestContext.currentTenantId();
        return await this.queryBus.execute(new application_1.GetPluginSettingByIdQuery(id, ['plugin', 'pluginTenant'], tenantId, null));
    }
    async bulkUpdateSettings(pluginId, bulkUpdateDto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.BulkUpdatePluginSettingsCommand(bulkUpdateDto, tenantId, organizationId, userId));
    }
    async updateAndValidate(pluginId, id, updateData) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        // Get current setting for validation
        const setting = await this.queryBus.execute(new application_1.GetPluginSettingByIdQuery(id, ['plugin', 'pluginTenant'], tenantId, organizationId));
        const isValid = await this.pluginSettingService.validateSetting(setting, updateData.value);
        // Update the setting if validation passes
        if (isValid) {
            const updatedSetting = await this.commandBus.execute(new application_1.UpdatePluginSettingCommand(id, updateData, tenantId, organizationId, userId));
            return {
                setting: updatedSetting,
                validation: { valid: true }
            };
        }
        else {
            return {
                setting,
                validation: {
                    valid: false,
                    errors: ['Validation failed']
                }
            };
        }
    }
    async delete(pluginId, id) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        await this.commandBus.execute(new application_1.DeletePluginSettingCommand(id, tenantId, organizationId, userId));
        return { deleted: true, id };
    }
};
exports.PluginSettingController = PluginSettingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create plugin setting' }),
    (0, swagger_1.ApiParam)({
        name: 'pluginId',
        description: 'Plugin ID',
        type: String,
        format: 'uuid'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Plugin setting created successfully',
        type: domain_1.PluginSetting
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.CreatePluginSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSettingController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all plugin settings' }),
    (0, swagger_1.ApiParam)({
        name: 'pluginId',
        description: 'Plugin ID',
        type: String,
        format: 'uuid'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        description: 'Filter by setting category'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'key',
        required: false,
        description: 'Filter by setting key'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pluginTenantId',
        required: false,
        description: 'Filter by plugin tenant ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin settings retrieved successfully',
        type: [domain_1.PluginSetting]
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.PluginSettingQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSettingController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get plugin setting by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin setting retrieved successfully',
        type: domain_1.PluginSetting
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin setting ID', type: String, format: 'uuid' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSettingController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update plugin settings' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin settings updated successfully',
        type: [domain_1.PluginSetting]
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Patch)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.BulkUpdatePluginSettingsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSettingController.prototype, "bulkUpdateSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update plugin setting and validate' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Setting updated and validation result',
        schema: {
            type: 'object',
            properties: {
                setting: { $ref: '#/components/schemas/PluginSetting' },
                validation: {
                    type: 'object',
                    properties: {
                        valid: { type: 'boolean' },
                        errors: { type: 'array', items: { type: 'string' } }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin setting ID', type: String, format: 'uuid' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSettingController.prototype, "updateAndValidate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete plugin setting' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin setting deleted successfully'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin setting ID', type: String, format: 'uuid' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSettingController.prototype, "delete", null);
exports.PluginSettingController = PluginSettingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Settings'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('plugins/:pluginId/settings'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        domain_1.PluginSettingService])
], PluginSettingController);
//# sourceMappingURL=plugin-setting.controller.js.map