"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPluginTenantsHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_all_plugin_tenants_query_1 = require("../get-all-plugin-tenants.query");
let GetAllPluginTenantsHandler = class GetAllPluginTenantsHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the get all plugin tenants query
     *
     * @param query - The query containing optional filters
     * @returns Array of plugin tenants matching the criteria
     */
    async execute(query) {
        const { filter } = query;
        // Build the where clause based on filters
        const where = {};
        // Add context-based filters
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        if (tenantId) {
            where.tenantId = tenantId;
        }
        if (organizationId) {
            where.organizationId = organizationId;
        }
        // Apply user-provided filters
        if (filter) {
            if (filter.pluginId) {
                where.pluginId = filter.pluginId;
            }
            if (filter.tenantId) {
                where.tenantId = filter.tenantId;
            }
            if (filter.organizationId) {
                where.organizationId = filter.organizationId;
            }
            if (typeof filter.enabled === 'boolean') {
                where.enabled = filter.enabled;
            }
            if (filter.scope) {
                where.scope = filter.scope;
            }
            if (typeof filter.isMandatory === 'boolean') {
                where.isMandatory = filter.isMandatory;
            }
            if (typeof filter.isDataCompliant === 'boolean') {
                where.isDataCompliant = filter.isDataCompliant;
            }
            // Handle isApproved filter - need to check if approvedAt is not null
            if (typeof filter.isApproved === 'boolean') {
                if (filter.isApproved) {
                    // Use raw query builder for complex conditions if needed
                    // For now, we'll handle this in the service layer or use a more complex query
                    // TODO: Implement complex filtering in service if required
                }
            }
        }
        const options = {
            where,
            relations: (0, core_1.parseFindOptionsRelations)(['plugin', 'approvedBy', 'allowedRoles', 'allowedUsers', 'deniedUsers']),
            order: { createdAt: 'DESC' }
        };
        const result = await this.pluginTenantService.findAll(options);
        return result.items || [];
    }
};
exports.GetAllPluginTenantsHandler = GetAllPluginTenantsHandler;
exports.GetAllPluginTenantsHandler = GetAllPluginTenantsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_all_plugin_tenants_query_1.GetAllPluginTenantsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetAllPluginTenantsHandler);
//# sourceMappingURL=get-all-plugin-tenants.handler.js.map