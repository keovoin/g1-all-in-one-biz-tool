"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsByPluginIdQuery = void 0;
class GetPluginSettingsByPluginIdQuery {
    constructor(pluginId, relations, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.relations = relations;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.GetPluginSettingsByPluginIdQuery = GetPluginSettingsByPluginIdQuery;
GetPluginSettingsByPluginIdQuery.type = '[Plugin Setting] Get By Plugin ID';
//# sourceMappingURL=get-plugin-settings-by-plugin-id.query.js.map