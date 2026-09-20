"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsByCategoryQuery = void 0;
class GetPluginSettingsByCategoryQuery {
    constructor(pluginId, categoryId, pluginTenantId, relations, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.categoryId = categoryId;
        this.pluginTenantId = pluginTenantId;
        this.relations = relations;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.GetPluginSettingsByCategoryQuery = GetPluginSettingsByCategoryQuery;
GetPluginSettingsByCategoryQuery.type = '[Plugin Setting] Get By Category';
//# sourceMappingURL=get-plugin-settings-by-category.query.js.map