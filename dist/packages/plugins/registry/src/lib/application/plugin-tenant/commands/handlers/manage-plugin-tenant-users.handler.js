"use strict";
var ManagePluginTenantUsersCommandHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagePluginTenantUsersCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const manage_plugin_tenant_users_command_1 = require("../manage-plugin-tenant-users.command");
let ManagePluginTenantUsersCommandHandler = ManagePluginTenantUsersCommandHandler_1 = class ManagePluginTenantUsersCommandHandler {
    constructor(pluginTenantService, userService, pluginSubscriptionService, pluginSubscriptionAccessService) {
        this.pluginTenantService = pluginTenantService;
        this.userService = userService;
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.pluginSubscriptionAccessService = pluginSubscriptionAccessService;
        this.logger = new common_1.Logger(ManagePluginTenantUsersCommandHandler_1.name);
    }
    /**
     * Executes the manage plugin tenant users command
     *
     * @param command - The command containing user management data
     * @returns The result of the operation with updated plugin tenant
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if plugin tenant or users not found
     */
    async execute(command) {
        const { pluginTenantId, userIds, operation } = command;
        this.logger.log(`Executing ${operation} operation for plugin tenant ${pluginTenantId} with ${userIds ? userIds.length : 0} users`);
        // Validate input
        if (!userIds || userIds.length === 0) {
            throw new common_1.BadRequestException('At least one user ID is required');
        }
        // Get plugin tenant with relations
        const { record: pluginTenant, success } = await this.pluginTenantService.findOneOrFailByIdString(pluginTenantId, {
            relations: ['allowedUsers', 'deniedUsers', 'plugin']
        });
        if (!success) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
        }
        // Validate users exist
        const users = await this.validateAndGetUsers(userIds);
        // Initialize arrays if not present
        if (!pluginTenant.allowedUsers) {
            pluginTenant.allowedUsers = [];
        }
        if (!pluginTenant.deniedUsers) {
            pluginTenant.deniedUsers = [];
        }
        // Execute operation
        let message;
        const affectedUserIds = [];
        switch (operation) {
            case 'allow':
                for (const user of users) {
                    pluginTenant.allowUser(user);
                    affectedUserIds.push(user.id);
                }
                message = `Successfully allowed ${users.length} user(s) to access the plugin`;
                break;
            case 'deny':
                for (const user of users) {
                    this.validate(user.id);
                    pluginTenant.denyUser(user);
                    affectedUserIds.push(user.id);
                }
                message = `Successfully denied ${users.length} user(s) from accessing the plugin`;
                break;
            case 'remove-allowed':
                for (const userId of userIds) {
                    this.validate(userId);
                    pluginTenant.removeAllowedUser(userId);
                    affectedUserIds.push(userId);
                }
                message = `Successfully removed ${userIds.length} user(s) from allowed list`;
                break;
            case 'remove-denied':
                for (const userId of userIds) {
                    this.validate(userId);
                    pluginTenant.removeDeniedUser(userId);
                    affectedUserIds.push(userId);
                }
                message = `Successfully removed ${userIds.length} user(s) from denied list`;
                break;
            case 'unassign':
                for (const userId of userIds) {
                    this.validate(userId);
                    pluginTenant.removeAllowedUser(userId);
                    pluginTenant.removeDeniedUser(userId);
                    affectedUserIds.push(userId);
                }
                message = `Successfully unassigned ${userIds.length} user(s) from the plugin`;
                break;
            default:
                throw new common_1.BadRequestException(`Unknown operation: ${operation}`);
        }
        // Save the updated plugin tenant first to persist allowed/denied users
        await this.pluginTenantService.save(pluginTenant);
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const tenantId = core_1.RequestContext.currentTenantId();
        const subscription = await this.pluginSubscriptionAccessService.findApplicableSubscription(pluginTenant.pluginId, tenantId, organizationId);
        // After allowed users are saved, create child subscriptions from parent
        switch (operation) {
            case 'allow':
                if (!subscription) {
                    throw new common_1.NotFoundException(`Subscription for Plugin Tenant ID "${pluginTenantId}" not found`);
                }
                await this.pluginSubscriptionService.createChildSubscriptions(subscription.id, affectedUserIds, tenantId, organizationId);
                break;
            case 'deny':
            case 'remove-allowed':
            case 'unassign':
                if (subscription) {
                    this.logger.log(`Revoking child subscriptions for ${affectedUserIds.length} user(s) due to ${operation} operation`);
                    await this.pluginSubscriptionService.revokeChildSubscriptions(subscription.id, affectedUserIds);
                }
                break;
        }
        // Fetch with full relations
        const { record: result, success: resultSuccess } = await this.pluginTenantService.findOneOrFailByIdString(pluginTenantId, {
            relations: ['plugin', 'allowedUsers', 'deniedUsers', 'allowedRoles']
        });
        if (!resultSuccess) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found after update`);
        }
        this.logger.log(`${operation} operation completed: ${message}`);
        return {
            pluginTenant: result,
            affectedUserIds,
            operation,
            message
        };
    }
    /**
     * Validate that all user IDs exist and return user entities
     */
    async validateAndGetUsers(userIds) {
        const users = await this.userService.find({
            where: { id: (0, typeorm_1.In)(userIds) }
        });
        if (users.length !== userIds.length) {
            const foundIds = users.map((u) => u.id);
            const missingIds = userIds.filter((id) => !foundIds.includes(id));
            throw new common_1.NotFoundException(`Users not found: ${missingIds.join(', ')}`);
        }
        return users;
    }
    validate(userId) {
        const currentUserId = core_1.RequestContext.currentUserId();
        if (userId === currentUserId) {
            throw new common_1.BadRequestException('Operation cannot be performed on the current user.');
        }
    }
};
exports.ManagePluginTenantUsersCommandHandler = ManagePluginTenantUsersCommandHandler;
exports.ManagePluginTenantUsersCommandHandler = ManagePluginTenantUsersCommandHandler = ManagePluginTenantUsersCommandHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(manage_plugin_tenant_users_command_1.ManagePluginTenantUsersCommand),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService,
        core_1.UserService,
        domain_1.PluginSubscriptionService,
        domain_1.PluginSubscriptionAccessService])
], ManagePluginTenantUsersCommandHandler);
//# sourceMappingURL=manage-plugin-tenant-users.handler.js.map