"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsByTenantIdHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_settings_by_tenant_id_query_1 = require("../get-plugin-settings-by-tenant-id.query");
let GetPluginSettingsByTenantIdHandler = class GetPluginSettingsByTenantIdHandler {
    constructor(pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }
    async execute(query) {
        const { pluginTenantId, relations, tenantId, organizationId } = query;
        try {
            if (!pluginTenantId) {
                throw new common_1.BadRequestException('Plugin tenant ID is required');
            }
            let settings = await this.pluginSettingService.findByPluginTenantId(pluginTenantId, relations || ['plugin', 'pluginTenant']);
            // Filter by tenant if provided
            if (tenantId) {
                settings = settings.filter((setting) => setting.tenantId === tenantId);
            }
            // Filter by organization if provided
            if (organizationId) {
                settings = settings.filter((setting) => setting.organizationId === organizationId);
            }
            return settings;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to get plugin settings by tenant ID: ${error.message}`);
        }
    }
};
exports.GetPluginSettingsByTenantIdHandler = GetPluginSettingsByTenantIdHandler;
exports.GetPluginSettingsByTenantIdHandler = GetPluginSettingsByTenantIdHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_settings_by_tenant_id_query_1.GetPluginSettingsByTenantIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService])
], GetPluginSettingsByTenantIdHandler);
//# sourceMappingURL=get-plugin-settings-by-tenant-id.handler.js.map