"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsByCategoryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_settings_by_category_query_1 = require("../get-plugin-settings-by-category.query");
let GetPluginSettingsByCategoryHandler = class GetPluginSettingsByCategoryHandler {
    constructor(pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }
    async execute(query) {
        const { pluginId, categoryId, pluginTenantId, relations, tenantId, organizationId } = query;
        try {
            if (!pluginId || !categoryId) {
                throw new common_1.BadRequestException('Plugin ID and category are required');
            }
            let settings = await this.pluginSettingService.findByCategory(pluginId, categoryId, pluginTenantId, relations || ['plugin', 'pluginTenant']);
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
            throw new common_1.BadRequestException(`Failed to get plugin settings by category: ${error.message}`);
        }
    }
};
exports.GetPluginSettingsByCategoryHandler = GetPluginSettingsByCategoryHandler;
exports.GetPluginSettingsByCategoryHandler = GetPluginSettingsByCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_settings_by_category_query_1.GetPluginSettingsByCategoryQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService])
], GetPluginSettingsByCategoryHandler);
//# sourceMappingURL=get-plugin-settings-by-category.handler.js.map