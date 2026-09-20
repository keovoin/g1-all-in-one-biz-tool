"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPluginsQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const list_plugins_query_1 = require("../list-plugins.query");
let ListPluginsQueryHandler = class ListPluginsQueryHandler {
    constructor(pluginService) {
        this.pluginService = pluginService;
    }
    /**
     * Executes the ListPluginsQuery and returns paginated plugin results
     * @param query - The query containing pagination and filter parameters
     * @returns A promise resolving to paginated plugin results
     */
    async execute(query) {
        const { params = {} } = query;
        return this.pluginService.paginate(params);
    }
};
exports.ListPluginsQueryHandler = ListPluginsQueryHandler;
exports.ListPluginsQueryHandler = ListPluginsQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(list_plugins_query_1.ListPluginsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginService])
], ListPluginsQueryHandler);
//# sourceMappingURL=list-plugins-query.handler.js.map