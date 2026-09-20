"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscriptionAccessQuery = void 0;
class GetSubscriptionAccessQuery {
    constructor(pluginId, tenantId, organizationId, userId) {
        this.pluginId = pluginId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.GetSubscriptionAccessQuery = GetSubscriptionAccessQuery;
GetSubscriptionAccessQuery.type = '[Plugin Subscription Access] Get Access';
//# sourceMappingURL=get-subscription-access.query.js.map