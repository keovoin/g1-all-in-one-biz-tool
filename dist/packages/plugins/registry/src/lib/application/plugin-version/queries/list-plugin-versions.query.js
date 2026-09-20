"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPluginVersionsQuery = void 0;
/**
 * Query to fetch paginated list of plugin versions
 */
class ListPluginVersionsQuery {
    /**
     * @param params - Pagination and filtering parameters for plugin versions
     */
    constructor(pluginId, params) {
        this.pluginId = pluginId;
        this.params = params;
    }
}
exports.ListPluginVersionsQuery = ListPluginVersionsQuery;
ListPluginVersionsQuery.type = '[Plugin Versions] List';
//# sourceMappingURL=list-plugin-versions.query.js.map