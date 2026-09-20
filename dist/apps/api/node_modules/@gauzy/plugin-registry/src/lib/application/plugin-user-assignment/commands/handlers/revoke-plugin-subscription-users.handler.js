"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokePluginSubscriptionUsersCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_subscription_access_service_1 = require("../../../../domain/services/plugin-subscription-access.service");
const plugin_subscription_service_1 = require("../../../../domain/services/plugin-subscription.service");
const plugin_tenant_service_1 = require("../../../../domain/services/plugin-tenant.service");
const plugin_user_assignment_service_1 = require("../../../../domain/services/plugin-user-assignment.service");
const revoke_plugin_subscription_users_command_1 = require("../../commands/revoke-plugin-subscription-users.command");
let RevokePluginSubscriptionUsersCommandHandler = class RevokePluginSubscriptionUsersCommandHandler {
    constructor(subscriptionAccessService, subscriptionService, userAssignmentService, pluginTenantService) {
        this.subscriptionAccessService = subscriptionAccessService;
        this.subscriptionService = subscriptionService;
        this.userAssignmentService = userAssignmentService;
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Execute revocation of users from plugin subscription
     *
     * Process:
     * 1. Validate revocation permission
     * 2. Find parent subscription
     * 3. Find PluginTenant for tracking
     * 4. Revoke child subscriptions (set status to CANCELLED)
     * 5. Remove user assignments from PluginTenant
     */
    async execute(command) {
        const { pluginId, revokeDto, tenantId, organizationId, requestingUserId } = command;
        try {
            // Validate that the requesting user has permission to revoke subscriptions
            await this.subscriptionAccessService.requireAssignmentPermission(pluginId, tenantId, organizationId, requestingUserId);
            // Find the parent subscription
            const parentSubscription = await this.subscriptionAccessService.findApplicableSubscription(pluginId, tenantId, organizationId);
            if (!parentSubscription) {
                throw new common_1.ForbiddenException('No valid parent subscription found for revocation');
            }
            // Find the PluginTenant for this plugin
            const pluginTenant = await this.pluginTenantService.findByPluginAndTenant(pluginId, tenantId, organizationId);
            if (!pluginTenant) {
                throw new common_1.NotFoundException('Plugin tenant configuration not found');
            }
            // Revoke child subscriptions for the users
            const revokedSubscriptions = await this.subscriptionService.revokeChildSubscriptions(parentSubscription.id, revokeDto.userIds);
            // Revoke users from the plugin using the PluginTenant ID
            const revocations = await this.userAssignmentService.unassignUsersFromPlugin(pluginTenant.id, revokeDto.userIds, revokeDto.revocationReason);
            return {
                message: `Successfully revoked access for ${revocations.length} user(s) and cancelled ${revokedSubscriptions.length} child subscription(s)`,
                revokedUsers: revocations.length
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to revoke users from plugin subscription: ${error.message}`);
        }
    }
};
exports.RevokePluginSubscriptionUsersCommandHandler = RevokePluginSubscriptionUsersCommandHandler;
exports.RevokePluginSubscriptionUsersCommandHandler = RevokePluginSubscriptionUsersCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(revoke_plugin_subscription_users_command_1.RevokePluginSubscriptionUsersCommand),
    tslib_1.__metadata("design:paramtypes", [plugin_subscription_access_service_1.PluginSubscriptionAccessService,
        plugin_subscription_service_1.PluginSubscriptionService,
        plugin_user_assignment_service_1.PluginUserAssignmentService,
        plugin_tenant_service_1.PluginTenantService])
], RevokePluginSubscriptionUsersCommandHandler);
//# sourceMappingURL=revoke-plugin-subscription-users.handler.js.map