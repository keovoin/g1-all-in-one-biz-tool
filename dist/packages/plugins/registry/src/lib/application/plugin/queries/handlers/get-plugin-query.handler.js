"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_query_1 = require("../get-plugin.query");
let GetPluginQueryHandler = class GetPluginQueryHandler {
    constructor(pluginService) {
        this.pluginService = pluginService;
    }
    async execute(query) {
        // Destructure the query to extract the plugin ID and options
        const { id, options } = query;
        // Step 1: Fetch the plugin entity from the database
        const plugin = await this.pluginService.findOneOrFailByIdString(id, options);
        // Step 2: Throw a NotFoundException if the plugin does not exist
        if (!plugin.success) {
            throw new common_1.NotFoundException(`Plugin with ID ${id} not found.`);
        }
        // Step 3: Return the plugin entity
        return plugin.record;
    }
};
exports.GetPluginQueryHandler = GetPluginQueryHandler;
exports.GetPluginQueryHandler = GetPluginQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_query_1.GetPluginQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginService])
], GetPluginQueryHandler);
//# sourceMappingURL=get-plugin-query.handler.js.map