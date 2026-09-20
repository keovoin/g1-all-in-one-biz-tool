"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantsByTenantQuery = void 0;
class GetPluginTenantsByTenantQuery {
    constructor(tenantId, organizationId, skip, take) {
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.skip = skip;
        this.take = take;
    }
}
exports.GetPluginTenantsByTenantQuery = GetPluginTenantsByTenantQuery;
GetPluginTenantsByTenantQuery.type = '[Plugin Tenant] Get By Tenant';
//# sourceMappingURL=get-plugin-tenants-by-tenant.query.js.map