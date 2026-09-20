"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DowngradePluginSubscriptionCommand = void 0;
class DowngradePluginSubscriptionCommand {
    constructor(subscriptionId, newPlanId, tenantId, organizationId, userId) {
        this.subscriptionId = subscriptionId;
        this.newPlanId = newPlanId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.DowngradePluginSubscriptionCommand = DowngradePluginSubscriptionCommand;
DowngradePluginSubscriptionCommand.type = '[Plugin Subscription] Downgrade';
//# sourceMappingURL=downgrade-plugin-subscription.command.js.map