"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_subscription_command_1 = require("../delete-plugin-subscription.command");
let DeletePluginSubscriptionCommandHandler = class DeletePluginSubscriptionCommandHandler {
    constructor(pluginSubscriptionService, pluginTenantService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.pluginTenantService = pluginTenantService;
    }
    async execute(command) {
        const { subscriptionId, pluginTenantId } = command;
        const userToRemoveId = core_1.RequestContext.currentUserId();
        try {
            // Remove the subscriber from the plugin tenant's allowed users.
            // Prefer the subscription's subscriberId; fall back to the current user.
            const tenant = await this.pluginTenantService.findOneByIdString(pluginTenantId);
            if (userToRemoveId) {
                // Remove the user from the allowed users of the tenant.
                tenant.removeAllowedUser(userToRemoveId);
                // Save the updated tenant.
                await this.pluginTenantService.save(tenant);
                // If the user to remove is the one who approved the tenant,
                if (tenant.approvedById === userToRemoveId) {
                    await this.pluginTenantService.deletePluginTenant(pluginTenantId);
                }
            }
            // Ensure the subscription record is removed so duplicate subscriptions
            // (same pluginId, subscriberId, tenantId) can be created later.
            const subscription = await this.pluginSubscriptionService.findOneByIdString(subscriptionId);
            if (subscription) {
                await this.pluginSubscriptionService.delete(subscription.id);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to delete plugin subscription: ${error.message}`);
        }
    }
};
exports.DeletePluginSubscriptionCommandHandler = DeletePluginSubscriptionCommandHandler;
exports.DeletePluginSubscriptionCommandHandler = DeletePluginSubscriptionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_subscription_command_1.DeletePluginSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService,
        domain_1.PluginTenantService])
], DeletePluginSubscriptionCommandHandler);
//# sourceMappingURL=delete-plugin-subscription.handler.js.map