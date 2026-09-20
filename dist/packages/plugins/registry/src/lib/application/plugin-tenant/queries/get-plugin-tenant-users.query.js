"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantUsersQuery = void 0;
/**
 * Query to get users for a plugin tenant (allowed, denied, or all)
 */
class GetPluginTenantUsersQuery {
    constructor(pluginTenantId, userType = 'all', skip, take, searchTerm) {
        this.pluginTenantId = pluginTenantId;
        this.userType = userType;
        this.skip = skip;
        this.take = take;
        this.searchTerm = searchTerm;
    }
}
exports.GetPluginTenantUsersQuery = GetPluginTenantUsersQuery;
GetPluginTenantUsersQuery.type = '[Plugin Tenant] Get Users';
//# sourceMappingURL=get-plugin-tenant-users.query.js.map