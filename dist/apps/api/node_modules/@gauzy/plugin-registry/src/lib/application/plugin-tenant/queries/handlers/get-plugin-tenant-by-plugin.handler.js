"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantByPluginHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const plugin_tenant_service_1 = require("../../../../domain/services/plugin-tenant.service");
const get_plugin_tenant_by_plugin_query_1 = require("../get-plugin-tenant-by-plugin.query");
let GetPluginTenantByPluginHandler = class GetPluginTenantByPluginHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the query to get a plugin tenant by plugin ID
     * If the plugin tenant doesn't exist, it will be created
     *
     * @param query - The query containing pluginId, tenantId, and optional organizationId
     * @returns Object with id and pluginId
     */
    async execute(query) {
        const { pluginId, tenantId, organizationId } = query;
        const subscriberId = core_1.RequestContext.currentUserId();
        //Add validation
        if (!pluginId) {
            throw new common_1.BadRequestException('Plugin ID is required');
        }
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        if (!subscriberId) {
            throw new common_1.BadRequestException('Subscriber ID is required from the request context');
        }
        try {
            // Find the plugin tenant
            const pluginTenant = await this.pluginTenantService.findOneByWhereOptions({
                pluginId,
                tenantId,
                organizationId,
                allowedUsers: {
                    id: (0, typeorm_1.In)([subscriberId])
                }
            });
            return {
                id: pluginTenant.id,
                pluginId
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plugin tenant for plugin ${pluginId}: ${error.message}`);
        }
    }
};
exports.GetPluginTenantByPluginHandler = GetPluginTenantByPluginHandler;
exports.GetPluginTenantByPluginHandler = GetPluginTenantByPluginHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_tenant_by_plugin_query_1.GetPluginTenantByPluginQuery),
    tslib_1.__metadata("design:paramtypes", [plugin_tenant_service_1.PluginTenantService])
], GetPluginTenantByPluginHandler);
//# sourceMappingURL=get-plugin-tenant-by-plugin.handler.js.map