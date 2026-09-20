"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const domain_1 = require("../../domain");
const shared_1 = require("../../shared");
let PluginSubscriptionController = class PluginSubscriptionController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async create(pluginId, purchaseDto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const user = core_1.RequestContext.currentUser();
        // Use the purchase command for creating subscriptions
        return await this.commandBus.execute(new application_1.PurchasePluginSubscriptionCommand({ ...purchaseDto, pluginId }, tenantId, organizationId, user?.id));
    }
    async findAll(pluginId, query, expiring, days, active, relations = ['plugin', 'pluginTenant', 'subscriber', 'plan']) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const subscriberId = query.subscriberId || core_1.RequestContext.currentUserId();
        // Note: Access checks and expiring subscriptions analytics have been moved to
        // plugin-subscription-analytics.controller.ts for better separation of concerns
        // Handle active subscription filter
        if (active) {
            const activeSubscription = await this.queryBus.execute(new application_1.GetActivePluginSubscriptionQuery(pluginId, tenantId, organizationId, query.subscriberId));
            return activeSubscription ? [activeSubscription] : [];
        }
        // Handle subscriber filter
        if (subscriberId) {
            return await this.queryBus.execute(new application_1.GetPluginSubscriptionsBySubscriberIdQuery(subscriberId, [
                'plugin',
                'pluginTenant',
                'subscriber',
                'plan',
                ...relations
            ]));
        }
        // Default: get subscriptions for this plugin
        return await this.queryBus.execute(new application_1.GetPluginSubscriptionsByPluginIdQuery(pluginId, [
            'plugin',
            'pluginTenant',
            'subscriber',
            'plan',
            ...relations
        ]));
    }
    async getCurrentSubscription(pluginId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const subscriberId = core_1.RequestContext.currentUserId();
        return this.queryBus.execute(new application_1.GetActivePluginSubscriptionQuery(pluginId, tenantId, organizationId, subscriberId));
    }
    async findOne(id) {
        return await this.queryBus.execute(new application_1.GetPluginSubscriptionByIdQuery(id, ['plugin', 'pluginTenant', 'subscriber']));
    }
    async updateStatus(pluginId, id, updateDto) {
        if (updateDto.status === 'cancelled') {
            return await this.commandBus.execute(new application_1.CancelPluginSubscriptionCommand(id, updateDto.reason));
        }
        else if (updateDto.status === 'renewed') {
            return await this.commandBus.execute(new application_1.RenewPluginSubscriptionCommand(id));
        }
        else {
            // For other status updates, use UpdatePluginSubscriptionCommand with minimal data
            const updateData = {};
            if (updateDto.status === 'active') {
                updateData.status = contracts_1.PluginSubscriptionStatus.ACTIVE;
            }
            else if (updateDto.status === 'expired') {
                updateData.status = contracts_1.PluginSubscriptionStatus.EXPIRED;
            }
            else if (updateDto.status === 'suspended') {
                updateData.status = contracts_1.PluginSubscriptionStatus.SUSPENDED;
            }
            return await this.commandBus.execute(new application_1.UpdatePluginSubscriptionCommand(id, updateData));
        }
    }
    async update(id, updateDto) {
        return await this.commandBus.execute(new application_1.UpdatePluginSubscriptionCommand(id, updateDto));
    }
    async upgrade(id, body) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.UpgradePluginSubscriptionCommand(id, body.planId, tenantId, organizationId, userId));
    }
    async downgrade(id, body) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.DowngradePluginSubscriptionCommand(id, body.planId, tenantId, organizationId, userId));
    }
    async delete(subscriberId, pluginTenantId) {
        await this.commandBus.execute(new application_1.DeletePluginSubscriptionCommand(subscriberId, pluginTenantId));
    }
};
exports.PluginSubscriptionController = PluginSubscriptionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create plugin subscription' }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Plugin subscription created successfully',
        type: domain_1.PluginSubscription
    }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.PurchasePluginSubscriptionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all plugin subscriptions' }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by subscription status' }),
    (0, swagger_1.ApiQuery)({ name: 'subscriberId', required: false, description: 'Filter by subscriber ID' }),
    (0, swagger_1.ApiQuery)({ name: 'expiring', required: false, description: 'Show only expiring subscriptions', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Days until expiry (default: 7)', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'active', required: false, description: 'Show only active subscriptions', type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin subscriptions retrieved successfully',
        type: [domain_1.PluginSubscription]
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__param(2, (0, common_1.Query)('expiring')),
    tslib_1.__param(3, (0, common_1.Query)('days')),
    tslib_1.__param(4, (0, common_1.Query)('active')),
    tslib_1.__param(5, (0, common_1.Query)('relations')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.PluginSubscriptionQueryDTO, Boolean, Number, Boolean, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get current user's active subscription for plugin" }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Current user's active plugin subscription retrieved successfully",
        type: domain_1.PluginSubscription
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_1.Get)('me'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "getCurrentSubscription", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get plugin subscription by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin subscription retrieved successfully',
        type: domain_1.PluginSubscription
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription ID' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update plugin subscription status' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin subscription updated successfully',
        type: domain_1.PluginSubscription
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription ID', type: String, format: 'uuid' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "updateStatus", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update plugin subscription' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin subscription updated successfully',
        type: domain_1.PluginSubscription
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription ID' }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.UpdatePluginSubscriptionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upgrade plugin subscription to a higher plan' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin subscription upgraded successfully',
        type: domain_1.PluginSubscription
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription ID', type: String, format: 'uuid' }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Post)(':id/upgrade'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "upgrade", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Downgrade plugin subscription to a lower plan' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plugin subscription downgraded successfully',
        type: domain_1.PluginSubscription
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription ID', type: String, format: 'uuid' }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Post)(':id/downgrade'),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "downgrade", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete plugin subscription' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Plugin subscription deleted successfully'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Plugin subscription ID' }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_DELETE),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    tslib_1.__param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Param)('pluginTenantId', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionController.prototype, "delete", null);
exports.PluginSubscriptionController = PluginSubscriptionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Subscriptions'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, common_1.Controller)('plugins/:pluginId/subscriptions'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginSubscriptionController);
//# sourceMappingURL=plugin-subscription.controller.js.map