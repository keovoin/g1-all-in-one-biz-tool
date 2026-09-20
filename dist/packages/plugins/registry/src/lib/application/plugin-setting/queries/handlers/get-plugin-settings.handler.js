"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingsHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_settings_query_1 = require("../get-plugin-settings.query");
let GetPluginSettingsHandler = class GetPluginSettingsHandler {
    constructor(pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }
    async execute(query) {
        const { options, tenantId, organizationId } = query;
        try {
            // Add tenant context to query options
            const queryOptions = {
                ...options,
                where: {
                    ...options?.where,
                    ...(tenantId && { tenantId }),
                    ...(organizationId && { organizationId })
                },
                relations: options?.relations || ['plugin', 'pluginTenant']
            };
            return await this.pluginSettingService.findAll(queryOptions);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get plugin settings: ${error.message}`);
        }
    }
};
exports.GetPluginSettingsHandler = GetPluginSettingsHandler;
exports.GetPluginSettingsHandler = GetPluginSettingsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_settings_query_1.GetPluginSettingsQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService])
], GetPluginSettingsHandler);
//# sourceMappingURL=get-plugin-settings.handler.js.map