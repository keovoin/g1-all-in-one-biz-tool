"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingValueQuery = void 0;
class GetPluginSettingValueQuery {
    constructor(pluginId, key, pluginTenantId, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.key = key;
        this.pluginTenantId = pluginTenantId;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.GetPluginSettingValueQuery = GetPluginSettingValueQuery;
GetPluginSettingValueQuery.type = '[Plugin Setting] Get Value';
//# sourceMappingURL=get-plugin-setting-value.query.js.map