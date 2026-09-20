"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPluginSourcesQuery = void 0;
/**
 * Query to fetch paginated list of plugin sources
 */
class ListPluginSourcesQuery {
    /**
     * @param params - Pagination and filtering parameters for plugin versions
     */
    constructor(pluginId, versionId, params) {
        this.pluginId = pluginId;
        this.versionId = versionId;
        this.params = params;
    }
}
exports.ListPluginSourcesQuery = ListPluginSourcesQuery;
ListPluginSourcesQuery.type = '[Plugin Sources] List';
//# sourceMappingURL=list-plugin-sources.query.js.map