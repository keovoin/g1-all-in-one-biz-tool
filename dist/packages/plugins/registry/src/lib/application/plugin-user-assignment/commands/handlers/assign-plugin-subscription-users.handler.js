"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignPluginSubscriptionUsersCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_subscription_access_service_1 = require("../../../../domain/services/plugin-subscription-access.service");
const plugin_subscription_service_1 = require("../../../../domain/services/plugin-subscription.service");
const plugin_tenant_service_1 = require("../../../../domain/services/plugin-tenant.service");
const plugin_user_assignment_service_1 = require("../../../../domain/services/plugin-user-assignment.service");
const assign_plugin_subscription_users_command_1 = require("../assign-plugin-subscription-users.command");
let AssignPluginSubscriptionUsersCommandHandler = class AssignPluginSubscriptionUsersCommandHandler {
    constructor(subscriptionAccessService, subscriptionService, userAssignmentService, pluginTenantService) {
        this.subscriptionAccessService = subscriptionAccessService;
        this.subscriptionService = subscriptionService;
        this.userAssignmentService = userAssignmentService;
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Execute assignment of users to plugin subscription
     *
     * Process:
     * 1. Validate assignment permission
     * 2. Find parent subscription (org/tenant level)
     * 3. Find or create PluginTenant for tracking
     * 4. Create child USER-scoped subscriptions
     * 5. Create user assignments in PluginTenant
     */
    async execute(command) {
        const { pluginId, assignDto, tenantId, organizationId, requestingUserId } = command;
        try {
            // Validate that the requesting user has permission to assign subscriptions
            await this.subscriptionAccessService.requireAssignmentPermission(pluginId, tenantId, organizationId, requestingUserId);
            // Find the parent subscription (organization/tenant level)
            const parentSubscription = await this.subscriptionAccessService.findApplicableSubscription(pluginId, tenantId, organizationId);
            if (!parentSubscription) {
                throw new common_1.ForbiddenException('No valid parent subscription found for assignment');
            }
            // Find or create a PluginTenant for assignment tracking
            const pluginTenantId = await this.pluginTenantService.findOrCreate({
                pluginId,
                tenantId,
                organizationId
            });
            // Create child subscriptions for the assigned users
            // These are USER-scoped subscriptions linked to the parent subscription
            const childSubscriptions = await this.subscriptionService.createChildSubscriptions(parentSubscription.id, assignDto.userIds, tenantId, organizationId);
            // Assign users to the plugin using the PluginTenant ID
            const assignments = await this.userAssignmentService.assignUsersToPlugin(pluginTenantId, assignDto.userIds, assignDto.reason);
            return {
                message: `Successfully assigned ${assignments.length} user(s) to the plugin with ${childSubscriptions.length} child subscription(s) created`,
                assignedUsers: assignments.length
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to assign users to plugin subscription: ${error.message}`);
        }
    }
};
exports.AssignPluginSubscriptionUsersCommandHandler = AssignPluginSubscriptionUsersCommandHandler;
exports.AssignPluginSubscriptionUsersCommandHandler = AssignPluginSubscriptionUsersCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(assign_plugin_subscription_users_command_1.AssignPluginSubscriptionUsersCommand),
    tslib_1.__metadata("design:paramtypes", [plugin_subscription_access_service_1.PluginSubscriptionAccessService,
        plugin_subscription_service_1.PluginSubscriptionService,
        plugin_user_assignment_service_1.PluginUserAssignmentService,
        plugin_tenant_service_1.PluginTenantService])
], AssignPluginSubscriptionUsersCommandHandler);
//# sourceMappingURL=assign-plugin-subscription-users.handler.js.map