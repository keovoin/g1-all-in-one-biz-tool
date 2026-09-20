"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantsByPluginHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_tenants_by_plugin_query_1 = require("../get-plugin-tenants-by-plugin.query");
let GetPluginTenantsByPluginHandler = class GetPluginTenantsByPluginHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the get plugin tenants by plugin query
     *
     * @param query - The query containing plugin ID
     * @returns Array of plugin tenants for the specified plugin
     * @throws BadRequestException if plugin ID is invalid
     */
    async execute(query) {
        const { pluginId, skip, take } = query;
        if (!pluginId) {
            throw new common_1.BadRequestException('Plugin ID is required');
        }
        return this.pluginTenantService.findByPluginId(pluginId, ['plugin', 'approvedBy', 'allowedRoles', 'allowedUsers', 'deniedUsers'], skip, take);
    }
};
exports.GetPluginTenantsByPluginHandler = GetPluginTenantsByPluginHandler;
exports.GetPluginTenantsByPluginHandler = GetPluginTenantsByPluginHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_tenants_by_plugin_query_1.GetPluginTenantsByPluginQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetPluginTenantsByPluginHandler);
//# sourceMappingURL=get-plugin-tenants-by-plugin.handler.js.map