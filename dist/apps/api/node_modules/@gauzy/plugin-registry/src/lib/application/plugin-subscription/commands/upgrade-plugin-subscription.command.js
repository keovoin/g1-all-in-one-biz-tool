"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradePluginSubscriptionCommand = void 0;
class UpgradePluginSubscriptionCommand {
    constructor(subscriptionId, newPlanId, tenantId, organizationId, userId) {
        this.subscriptionId = subscriptionId;
        this.newPlanId = newPlanId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.UpgradePluginSubscriptionCommand = UpgradePluginSubscriptionCommand;
UpgradePluginSubscriptionCommand.type = '[Plugin Subscription] Upgrade';
//# sourceMappingURL=upgrade-plugin-subscription.command.js.map