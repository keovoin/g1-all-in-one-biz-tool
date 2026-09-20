"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPluginTenantAccessQuery = void 0;
class CheckPluginTenantAccessQuery {
    constructor(userId, pluginId, userRoles, tenantId, organizationId) {
        this.userId = userId;
        this.pluginId = pluginId;
        this.userRoles = userRoles;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.CheckPluginTenantAccessQuery = CheckPluginTenantAccessQuery;
CheckPluginTenantAccessQuery.type = '[Plugin Tenant] Check Access';
//# sourceMappingURL=check-plugin-tenant-access.query.js.map