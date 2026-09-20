"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionPlanController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_2 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const domain_1 = require("../../domain");
const shared_1 = require("../../shared");
let PluginSubscriptionPlanController = class PluginSubscriptionPlanController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async create(createDto) {
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.CreatePluginSubscriptionPlanCommand(createDto, userId));
    }
    async createMultiple(createDto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.BulkCreatePluginPlansCommand(createDto.plans, tenantId, organizationId, userId));
    }
    async findAll(query) {
        return await this.queryBus.execute(new application_1.ListPluginSubscriptionPlansQuery(query));
    }
    async getActivePlans(pluginId, type) {
        return await this.queryBus.execute(new application_1.GetActivePluginPlansQuery(pluginId, type));
    }
    async getByPluginId(pluginId) {
        return await this.queryBus.execute(new application_1.GetPluginSubscriptionPlansByPluginIdQuery(pluginId));
    }
    async findOne(id) {
        return await this.queryBus.execute(new application_1.GetPluginSubscriptionPlanByIdQuery(id, ['plugin']));
    }
    async update(id, updateDto) {
        return await this.commandBus.execute(new application_1.UpdatePluginSubscriptionPlanCommand(id, updateDto));
    }
    async partialUpdate(id, updateDto) {
        return await this.commandBus.execute(new application_1.UpdatePluginSubscriptionPlanCommand(id, updateDto));
    }
    async delete(id) {
        await this.commandBus.execute(new application_1.DeletePluginSubscriptionPlanCommand(id));
    }
    async copy(copyDto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const user = core_1.RequestContext.currentUser();
        return await this.commandBus.execute(new application_1.CopyPluginPlanCommand(copyDto, tenantId, organizationId, user?.id));
    }
    async bulkOperation(operationDto) {
        await this.commandBus.execute(new application_1.BulkPluginPlanOperationCommand(operationDto));
    }
    async getAnalytics(analyticsDto) {
        return await this.queryBus.execute(new application_1.GetPluginPlanAnalyticsQuery(analyticsDto));
    }
};
exports.PluginSubscriptionPlanController = PluginSubscriptionPlanController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create plugin subscription plan' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.CREATED,
        description: 'Plugin subscription plan created successfully',
        type: domain_1.PluginSubscriptionPlan
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_2.Post)(),
    tslib_1.__param(0, (0, common_2.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.CreatePluginSubscriptionPlanDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple plugin subscription plans' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.CREATED,
        description: 'Plugin subscription plans created successfully',
        type: [domain_1.PluginSubscriptionPlan]
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_2.Post)('bulk-create'),
    tslib_1.__param(0, (0, common_2.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.CreateMultiplePluginPlansDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "createMultiple", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all plugin subscription plans' }),
    (0, swagger_1.ApiQuery)({ name: 'pluginId', required: false, description: 'Filter by plugin ID' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by plan type' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, description: 'Filter by active status', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'isPopular', required: false, description: 'Filter by popular status', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'isRecommended', required: false, description: 'Filter by recommended status', type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Plugin subscription plans retrieved successfully',
        type: [domain_1.PluginSubscriptionPlan]
    }),
    (0, common_1.Public)(),
    (0, common_2.Get)(),
    tslib_1.__param(0, (0, common_2.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.PluginSubscriptionPlanQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get active plugin subscription plans' }),
    (0, swagger_1.ApiQuery)({ name: 'pluginId', required: false, description: 'Filter by plugin ID' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by plan type' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Active plugin subscription plans retrieved successfully',
        type: [domain_1.PluginSubscriptionPlan]
    }),
    (0, common_1.Public)(),
    (0, common_2.Get)('active'),
    tslib_1.__param(0, (0, common_2.Query)('pluginId')),
    tslib_1.__param(1, (0, common_2.Query)('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "getActivePlans", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get plugin subscription plans by plugin ID' }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Plugin subscription plans retrieved successfully',
        type: [domain_1.PluginSubscriptionPlan]
    }),
    (0, common_1.Public)(),
    (0, common_2.Get)('plugin/:pluginId'),
    tslib_1.__param(0, (0, common_2.Param)('pluginId', common_2.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "getByPluginId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get plugin subscription plan by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription plan ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Plugin subscription plan retrieved successfully',
        type: domain_1.PluginSubscriptionPlan
    }),
    (0, common_1.Public)(),
    (0, common_2.Get)(':id'),
    tslib_1.__param(0, (0, common_2.Param)('id', common_2.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update plugin subscription plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription plan ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Plugin subscription plan updated successfully',
        type: domain_1.PluginSubscriptionPlan
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_2.Put)(':id'),
    tslib_1.__param(0, (0, common_2.Param)('id', common_2.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_2.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.UpdatePluginSubscriptionPlanDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Partially update plugin subscription plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription plan ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Plugin subscription plan updated successfully',
        type: domain_1.PluginSubscriptionPlan
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_2.Patch)(':id'),
    tslib_1.__param(0, (0, common_2.Param)('id', common_2.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_2.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "partialUpdate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete plugin subscription plan' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription plan ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.NO_CONTENT,
        description: 'Plugin subscription plan deleted successfully'
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_DELETE),
    (0, common_2.Delete)(':id'),
    (0, common_2.HttpCode)(common_2.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_2.Param)('id', common_2.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Copy plugin subscription plan' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.CREATED,
        description: 'Plugin subscription plan copied successfully',
        type: domain_1.PluginSubscriptionPlan
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_2.Post)('copy'),
    tslib_1.__param(0, (0, common_2.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.CopyPluginPlanDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "copy", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Bulk operations on plugin subscription plans' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Bulk operation completed successfully'
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_2.Post)('bulk'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    tslib_1.__param(0, (0, common_2.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.BulkPluginPlanOperationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "bulkOperation", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get plugin subscription plan analytics' }),
    (0, swagger_1.ApiResponse)({
        status: common_2.HttpStatus.OK,
        description: 'Plugin subscription plan analytics retrieved successfully'
    }),
    (0, common_2.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_2.Post)('analytics'),
    tslib_1.__param(0, (0, common_2.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [shared_1.PluginPlanAnalyticsDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionPlanController.prototype, "getAnalytics", null);
exports.PluginSubscriptionPlanController = PluginSubscriptionPlanController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Subscription Plans'),
    (0, common_2.Controller)('plugin-plans'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginSubscriptionPlanController);
//# sourceMappingURL=plugin-subscription-plan.controller.js.map