"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantsByTenantHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_tenants_by_tenant_query_1 = require("../get-plugin-tenants-by-tenant.query");
let GetPluginTenantsByTenantHandler = class GetPluginTenantsByTenantHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the get plugin tenants by tenant query
     *
     * @param query - The query containing tenant ID and optional organization ID
     * @returns Array of plugin tenants for the specified tenant/organization
     * @throws BadRequestException if tenant ID is invalid
     */
    async execute(query) {
        const { tenantId, organizationId, skip, take } = query;
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        return this.pluginTenantService.findByTenantId(tenantId, organizationId, ['plugin', 'approvedBy', 'allowedRoles', 'allowedUsers', 'deniedUsers'], skip, take);
    }
};
exports.GetPluginTenantsByTenantHandler = GetPluginTenantsByTenantHandler;
exports.GetPluginTenantsByTenantHandler = GetPluginTenantsByTenantHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_tenants_by_tenant_query_1.GetPluginTenantsByTenantQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetPluginTenantsByTenantHandler);
//# sourceMappingURL=get-plugin-tenants-by-tenant.handler.js.map