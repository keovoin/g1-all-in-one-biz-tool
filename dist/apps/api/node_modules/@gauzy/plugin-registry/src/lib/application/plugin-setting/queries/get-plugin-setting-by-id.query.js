"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingByIdQuery = void 0;
class GetPluginSettingByIdQuery {
    constructor(id, relations, tenantId, organizationId) {
        this.id = id;
        this.relations = relations;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.GetPluginSettingByIdQuery = GetPluginSettingByIdQuery;
GetPluginSettingByIdQuery.type = '[Plugin Setting] Get By ID';
//# sourceMappingURL=get-plugin-setting-by-id.query.js.map