"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsByTenantIdQuery = void 0;
class GetPluginSettingsByTenantIdQuery {
    constructor(pluginTenantId, relations, tenantId, organizationId) {
        this.pluginTenantId = pluginTenantId;
        this.relations = relations;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.GetPluginSettingsByTenantIdQuery = GetPluginSettingsByTenantIdQuery;
GetPluginSettingsByTenantIdQuery.type = '[Plugin Setting] Get By Tenant ID';
//# sourceMappingURL=get-plugin-settings-by-tenant-id.query.js.map