"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsByKeyQuery = void 0;
class GetPluginSettingsByKeyQuery {
    constructor(pluginId, key, pluginTenantId, relations, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.key = key;
        this.pluginTenantId = pluginTenantId;
        this.relations = relations;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.GetPluginSettingsByKeyQuery = GetPluginSettingsByKeyQuery;
GetPluginSettingsByKeyQuery.type = '[Plugin Setting] Get By Key';
//# sourceMappingURL=get-plugin-setting-by-key.query.js.map