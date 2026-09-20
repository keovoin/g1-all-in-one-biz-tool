"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionAccessController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const shared_1 = require("../../shared");
let PluginSubscriptionAccessController = class PluginSubscriptionAccessController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Check if current user has access to the plugin
     */
    async checkAccess(pluginId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.queryBus.execute(new application_1.GetSubscriptionAccessQuery(pluginId, tenantId, organizationId, userId));
    }
    /**
     * Check if a specific user has access to the plugin
     */
    async checkUserAccess(pluginId, dto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        return await this.queryBus.execute(new application_1.CheckUserSubscriptionAccessQuery(pluginId, dto.userId, tenantId, organizationId));
    }
    /**
     * Assign plugin subscription to users (for organization/tenant level subscriptions)
     */
    async assignUsers(pluginId, dto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.AssignPluginSubscriptionUsersCommand(pluginId, dto, tenantId, organizationId, userId));
    }
    /**
     * Revoke plugin subscription assignment from users
     */
    async revokeUsers(pluginId, dto) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const userId = core_1.RequestContext.currentUserId();
        return await this.commandBus.execute(new application_1.RevokePluginSubscriptionUsersCommand(pluginId, dto, tenantId, organizationId, userId));
    }
};
exports.PluginSubscriptionAccessController = PluginSubscriptionAccessController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Check plugin subscription access',
        description: 'Validates if the current user has an active subscription to access the plugin'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Access check result',
        type: shared_1.PluginSubscriptionAccessResponseDTO
    }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionAccessController.prototype, "checkAccess", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Check user plugin access',
        description: 'Validates if a specific user has access to the plugin'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Access check result',
        type: shared_1.PluginSubscriptionAccessResponseDTO
    }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_VIEW),
    (0, common_1.Post)('check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.CheckPluginSubscriptionAccessDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionAccessController.prototype, "checkUserAccess", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Assign plugin subscription to users',
        description: 'Assigns a plugin to specific users when the organization or tenant owns an active subscription. This enables sharing organization/tenant-level subscriptions with team members.'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Users successfully assigned to plugin subscription'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to assign subscriptions'
    }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Post)('assign'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.AssignPluginSubscriptionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionAccessController.prototype, "assignUsers", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Revoke plugin subscription from users',
        description: 'Removes plugin access from specific users at the organization/tenant level'
    }),
    (0, swagger_1.ApiParam)({ name: 'pluginId', description: 'Plugin ID', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Users successfully removed from plugin subscription'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to revoke subscriptions'
    }),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.PLUGIN_CONFIGURE),
    (0, common_1.Post)('revoke'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Param)('pluginId', common_1.ParseUUIDPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.RevokePluginSubscriptionAssignmentDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSubscriptionAccessController.prototype, "revokeUsers", null);
exports.PluginSubscriptionAccessController = PluginSubscriptionAccessController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Subscription Access'),
    (0, common_1.Controller)('plugins/:pluginId/subscription/access'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], PluginSubscriptionAccessController);
//# sourceMappingURL=plugin-subscription-access.controller.js.map