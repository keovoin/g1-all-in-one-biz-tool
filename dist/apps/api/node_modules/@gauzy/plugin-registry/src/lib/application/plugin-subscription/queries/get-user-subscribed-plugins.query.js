"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserSubscribedPluginsQuery = void 0;
/**
 * Query to retrieve all plugins where a user has an active subscription
 */
class GetUserSubscribedPluginsQuery {
    constructor(userId, tenantId, organizationId, options) {
        this.userId = userId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.options = options;
    }
}
exports.GetUserSubscribedPluginsQuery = GetUserSubscribedPluginsQuery;
GetUserSubscribedPluginsQuery.type = '[Plugin] Get User Subscribed Plugins';
//# sourceMappingURL=get-user-subscribed-plugins.query.js.map