"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantByIdHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_tenant_by_id_query_1 = require("../get-plugin-tenant-by-id.query");
let GetPluginTenantByIdHandler = class GetPluginTenantByIdHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the get plugin tenant by ID query
     *
     * @param query - The query containing plugin tenant ID
     * @returns The plugin tenant with full relations
     * @throws NotFoundException if plugin tenant not found
     */
    async execute(query) {
        const { id } = query;
        const pluginTenant = await this.pluginTenantService.findOneByIdString(id, {
            relations: [
                'plugin',
                'approvedBy',
                'allowedRoles',
                'allowedUsers',
                'deniedUsers',
                'settings',
                'subscriptions'
            ]
        });
        if (!pluginTenant) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${id}" not found`);
        }
        return pluginTenant;
    }
};
exports.GetPluginTenantByIdHandler = GetPluginTenantByIdHandler;
exports.GetPluginTenantByIdHandler = GetPluginTenantByIdHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_tenant_by_id_query_1.GetPluginTenantByIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetPluginTenantByIdHandler);
//# sourceMappingURL=get-plugin-tenant-by-id.handler.js.map