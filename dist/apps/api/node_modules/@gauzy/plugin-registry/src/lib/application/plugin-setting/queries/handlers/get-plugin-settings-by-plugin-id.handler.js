"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsByPluginIdHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_settings_by_plugin_id_query_1 = require("../get-plugin-settings-by-plugin-id.query");
let GetPluginSettingsByPluginIdHandler = class GetPluginSettingsByPluginIdHandler {
    constructor(pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }
    async execute(query) {
        const { pluginId, relations, tenantId, organizationId } = query;
        try {
            if (!pluginId) {
                throw new common_1.BadRequestException('Plugin ID is required');
            }
            let settings = await this.pluginSettingService.findByPluginId(pluginId, relations || ['plugin', 'pluginTenant']);
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
            throw new common_1.BadRequestException(`Failed to get plugin settings by plugin ID: ${error.message}`);
        }
    }
};
exports.GetPluginSettingsByPluginIdHandler = GetPluginSettingsByPluginIdHandler;
exports.GetPluginSettingsByPluginIdHandler = GetPluginSettingsByPluginIdHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_settings_by_plugin_id_query_1.GetPluginSettingsByPluginIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService])
], GetPluginSettingsByPluginIdHandler);
//# sourceMappingURL=get-plugin-settings-by-plugin-id.handler.js.map