"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPluginVersionsQueryHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const list_plugin_versions_query_1 = require("../list-plugin-versions.query");
let ListPluginVersionsQueryHandler = class ListPluginVersionsQueryHandler {
    constructor(pluginVersionService, pluginService) {
        this.pluginVersionService = pluginVersionService;
        this.pluginService = pluginService;
    }
    /**
     * Handles the ListPluginVersionsQuery and returns a paginated list of plugin versions.
     *
     * @param query - The query containing plugin ID and pagination options.
     * @returns A promise resolving to paginated plugin version results.
     */
    async execute(query) {
        const { pluginId, params } = query;
        const { where } = params;
        const userId = core_1.RequestContext.currentUserId();
        const withDeleted = await this.pluginService.validatePluginOwnership(pluginId, userId);
        return this.pluginVersionService.paginate({
            ...params,
            withDeleted,
            where: Object.assign({}, where, { pluginId })
        });
    }
};
exports.ListPluginVersionsQueryHandler = ListPluginVersionsQueryHandler;
exports.ListPluginVersionsQueryHandler = ListPluginVersionsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(list_plugin_versions_query_1.ListPluginVersionsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService,
        domain_1.PluginService])
], ListPluginVersionsQueryHandler);
//# sourceMappingURL=list-plugin-versions-query.handler.js.map