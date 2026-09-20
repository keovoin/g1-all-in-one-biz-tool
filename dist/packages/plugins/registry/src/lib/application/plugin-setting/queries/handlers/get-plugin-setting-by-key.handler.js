"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingByKeyHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_setting_by_key_query_1 = require("../get-plugin-setting-by-key.query");
let GetPluginSettingByKeyHandler = class GetPluginSettingByKeyHandler {
    constructor(pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }
    async execute(query) {
        const { pluginId, key, pluginTenantId, relations, tenantId, organizationId } = query;
        try {
            if (!pluginId || !key) {
                throw new common_1.BadRequestException('Plugin ID and key are required');
            }
            const setting = await this.pluginSettingService.findByKey(pluginId, key, pluginTenantId, relations || ['plugin', 'pluginTenant']);
            if (!setting) {
                return null;
            }
            // Verify tenant access
            if (tenantId && setting.tenantId !== tenantId) {
                throw new common_1.BadRequestException('Access denied to this plugin setting');
            }
            // Verify organization access
            if (organizationId && setting.organizationId !== organizationId) {
                throw new common_1.BadRequestException('Access denied to this plugin setting');
            }
            return setting;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to get plugin setting by key: ${error.message}`);
        }
    }
};
exports.GetPluginSettingByKeyHandler = GetPluginSettingByKeyHandler;
exports.GetPluginSettingByKeyHandler = GetPluginSettingByKeyHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_setting_by_key_query_1.GetPluginSettingsByKeyQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService])
], GetPluginSettingByKeyHandler);
//# sourceMappingURL=get-plugin-setting-by-key.handler.js.map