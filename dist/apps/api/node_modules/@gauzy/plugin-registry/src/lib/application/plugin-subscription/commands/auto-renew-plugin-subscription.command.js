"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoRenewPluginSubscriptionCommand = void 0;
class AutoRenewPluginSubscriptionCommand {
    constructor(subscriptionId, tenantId, organizationId) {
        this.subscriptionId = subscriptionId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.AutoRenewPluginSubscriptionCommand = AutoRenewPluginSubscriptionCommand;
AutoRenewPluginSubscriptionCommand.type = '[Plugin Subscription] Auto Renew';
//# sourceMappingURL=auto-renew-plugin-subscription.command.js.map