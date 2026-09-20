"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantStatisticsHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_tenant_statistics_query_1 = require("../get-plugin-tenant-statistics.query");
let GetPluginTenantStatisticsHandler = class GetPluginTenantStatisticsHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the get plugin tenant statistics query
     *
     * @param query - The query containing optional tenant and organization filters
     * @returns Statistics about plugin tenant usage
     */
    async execute(query) {
        const { tenantId, organizationId } = query;
        // Use context if no explicit tenant provided
        const contextTenantId = tenantId || core_1.RequestContext.currentTenantId();
        const contextOrgId = organizationId || core_1.RequestContext.currentOrganizationId();
        // Build base where clause
        const where = {};
        if (contextTenantId) {
            where.tenantId = contextTenantId;
        }
        if (contextOrgId) {
            where.organizationId = contextOrgId;
        }
        // Get all plugin tenants matching criteria
        const result = await this.pluginTenantService.findAll({ where });
        const pluginTenants = result.items || [];
        // Calculate statistics
        const statistics = {
            totalPluginTenants: pluginTenants.length,
            enabledCount: pluginTenants.filter((pt) => pt.enabled).length,
            disabledCount: pluginTenants.filter((pt) => !pt.enabled).length,
            approvedCount: pluginTenants.filter((pt) => pt.approvedAt !== null && pt.approvedAt !== undefined).length,
            pendingApprovalCount: pluginTenants.filter((pt) => pt.requiresApproval && (!pt.approvedAt || pt.approvedAt === null)).length,
            totalInstallations: pluginTenants.reduce((sum, pt) => sum + (pt.currentInstallations || 0), 0),
            totalActiveUsers: pluginTenants.reduce((sum, pt) => sum + (pt.currentActiveUsers || 0), 0),
            quotaExceededCount: 0, // We'll calculate this
            byScope: {
                [contracts_1.PluginScope.USER]: 0,
                [contracts_1.PluginScope.ORGANIZATION]: 0,
                [contracts_1.PluginScope.TENANT]: 0
            }
        };
        // Calculate quota exceeded and scope breakdown
        for (const pluginTenant of pluginTenants) {
            // Check if quota is exceeded
            const maxInstallations = pluginTenant.maxInstallations;
            const maxActiveUsers = pluginTenant.maxActiveUsers;
            const currentInstallations = pluginTenant.currentInstallations || 0;
            const currentActiveUsers = pluginTenant.currentActiveUsers || 0;
            const isInstallationQuotaExceeded = maxInstallations !== null &&
                maxInstallations !== undefined &&
                maxInstallations !== -1 &&
                currentInstallations > maxInstallations;
            const isUserQuotaExceeded = maxActiveUsers !== null &&
                maxActiveUsers !== undefined &&
                maxActiveUsers !== -1 &&
                currentActiveUsers > maxActiveUsers;
            if (isInstallationQuotaExceeded || isUserQuotaExceeded) {
                statistics.quotaExceededCount++;
            }
            // Count by scope
            if (pluginTenant.scope in statistics.byScope) {
                statistics.byScope[pluginTenant.scope]++;
            }
        }
        return statistics;
    }
};
exports.GetPluginTenantStatisticsHandler = GetPluginTenantStatisticsHandler;
exports.GetPluginTenantStatisticsHandler = GetPluginTenantStatisticsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_tenant_statistics_query_1.GetPluginTenantStatisticsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetPluginTenantStatisticsHandler);
//# sourceMappingURL=get-plugin-tenant-statistics.handler.js.map