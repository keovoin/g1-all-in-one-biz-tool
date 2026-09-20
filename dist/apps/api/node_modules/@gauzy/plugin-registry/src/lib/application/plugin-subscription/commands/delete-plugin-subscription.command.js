"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginSubscriptionCommand = void 0;
class DeletePluginSubscriptionCommand {
    constructor(subscriptionId, pluginTenantId) {
        this.subscriptionId = subscriptionId;
        this.pluginTenantId = pluginTenantId;
    }
}
exports.DeletePluginSubscriptionCommand = DeletePluginSubscriptionCommand;
DeletePluginSubscriptionCommand.type = '[Plugin Subscription] Delete';
//# sourceMappingURL=delete-plugin-subscription.command.js.map