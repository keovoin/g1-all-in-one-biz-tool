"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPluginTenantAccessHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const check_plugin_tenant_access_query_1 = require("../check-plugin-tenant-access.query");
let CheckPluginTenantAccessHandler = class CheckPluginTenantAccessHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the check plugin tenant access query
     *
     * @param query - The query containing user and plugin access check data
     * @returns Access check result with plugin tenant if access is granted
     * @throws BadRequestException if required parameters are missing
     */
    async execute(query) {
        const { userId, pluginId, userRoles, tenantId, organizationId } = query;
        if (!userId || !pluginId || !userRoles) {
            throw new common_1.BadRequestException('User ID, Plugin ID, and user roles are required');
        }
        // Find plugin tenant relationship
        const pluginTenant = await this.pluginTenantService.findByPluginAndTenant(pluginId, tenantId, organizationId);
        if (!pluginTenant) {
            return {
                hasAccess: false,
                denialReason: 'Plugin is not installed for this tenant/organization'
            };
        }
        // Convert to entity to use business logic methods
        const entity = Object.assign(new domain_1.PluginTenant(), pluginTenant);
        // Check if plugin is available
        if (!entity.isAvailable()) {
            return {
                hasAccess: false,
                denialReason: 'Plugin is not available (disabled or archived)'
            };
        }
        // Check user access using business logic
        const hasAccess = entity.hasUserAccess(userId, userRoles);
        if (!hasAccess) {
            return {
                hasAccess: false,
                denialReason: 'User does not have permission to access this plugin'
            };
        }
        // Access granted
        return {
            hasAccess: true,
            pluginTenant: pluginTenant
        };
    }
};
exports.CheckPluginTenantAccessHandler = CheckPluginTenantAccessHandler;
exports.CheckPluginTenantAccessHandler = CheckPluginTenantAccessHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(check_plugin_tenant_access_query_1.CheckPluginTenantAccessQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], CheckPluginTenantAccessHandler);
//# sourceMappingURL=check-plugin-tenant-access.handler.js.map