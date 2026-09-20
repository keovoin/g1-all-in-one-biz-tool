"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivePluginSubscriptionQuery = void 0;
class GetActivePluginSubscriptionQuery {
    constructor(pluginId, tenantId, organizationId, subscriberId) {
        this.pluginId = pluginId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.subscriberId = subscriberId;
    }
}
exports.GetActivePluginSubscriptionQuery = GetActivePluginSubscriptionQuery;
GetActivePluginSubscriptionQuery.type = '[Plugin Subscription] Get Active';
//# sourceMappingURL=get-active-plugin-subscription.query.js.map