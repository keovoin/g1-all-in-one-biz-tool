"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantQuotaInfoHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_tenant_quota_info_query_1 = require("../get-plugin-tenant-quota-info.query");
let GetPluginTenantQuotaInfoHandler = class GetPluginTenantQuotaInfoHandler {
    constructor(pluginTenantService) {
        this.pluginTenantService = pluginTenantService;
    }
    /**
     * Executes the get plugin tenant quota info query
     *
     * @param query - The query containing plugin tenant ID
     * @returns Quota information for the plugin tenant
     * @throws BadRequestException if plugin tenant ID is missing
     * @throws NotFoundException if plugin tenant not found
     */
    async execute(query) {
        const { pluginTenantId } = query;
        if (!pluginTenantId) {
            throw new common_1.BadRequestException('Plugin tenant ID is required');
        }
        // Find plugin tenant
        const pluginTenant = await this.pluginTenantService.findOneByIdString(pluginTenantId);
        if (!pluginTenant) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
        }
        // Convert to entity to use business logic methods
        const entity = Object.assign(new domain_1.PluginTenant(), pluginTenant);
        // Build quota info using business logic
        const quotaInfo = {
            maxInstallations: entity.maxInstallations,
            currentInstallations: entity.currentInstallations || 0,
            canInstallMore: entity.canInstallMore(),
            installationUtilization: entity.installationUtilization || 0,
            maxActiveUsers: entity.maxActiveUsers,
            currentActiveUsers: entity.currentActiveUsers || 0,
            canAddMoreUsers: entity.canAddMoreUsers(),
            userUtilization: entity.userUtilization || 0,
            isQuotaExceeded: entity.isQuotaExceeded || false
        };
        return quotaInfo;
    }
};
exports.GetPluginTenantQuotaInfoHandler = GetPluginTenantQuotaInfoHandler;
exports.GetPluginTenantQuotaInfoHandler = GetPluginTenantQuotaInfoHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_tenant_quota_info_query_1.GetPluginTenantQuotaInfoQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginTenantService])
], GetPluginTenantQuotaInfoHandler);
//# sourceMappingURL=get-plugin-tenant-quota-info.handler.js.map