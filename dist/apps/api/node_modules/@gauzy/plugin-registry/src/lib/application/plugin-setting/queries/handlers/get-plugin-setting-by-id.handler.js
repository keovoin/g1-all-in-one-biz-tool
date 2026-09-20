"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginSettingByIdHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const get_plugin_setting_by_id_query_1 = require("../get-plugin-setting-by-id.query");
let GetPluginSettingByIdHandler = class GetPluginSettingByIdHandler {
    constructor(pluginSettingService) {
        this.pluginSettingService = pluginSettingService;
    }
    async execute(query) {
        const { id, relations, tenantId, organizationId } = query;
        try {
            const pluginSetting = await this.pluginSettingService.findOneByIdString(id, {
                relations: relations || ['plugin', 'pluginTenant']
            });
            if (!pluginSetting) {
                throw new common_1.NotFoundException(`Plugin setting with ID "${id}" not found`);
            }
            // Verify tenant access
            if (tenantId && pluginSetting.tenantId !== tenantId) {
                throw new common_1.BadRequestException('Access denied to this plugin setting');
            }
            // Verify organization access
            if (organizationId && pluginSetting.organizationId !== organizationId) {
                throw new common_1.BadRequestException('Access denied to this plugin setting');
            }
            return pluginSetting;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to get plugin setting: ${error.message}`);
        }
    }
};
exports.GetPluginSettingByIdHandler = GetPluginSettingByIdHandler;
exports.GetPluginSettingByIdHandler = GetPluginSettingByIdHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_setting_by_id_query_1.GetPluginSettingByIdQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService])
], GetPluginSettingByIdHandler);
//# sourceMappingURL=get-plugin-setting-by-id.handler.js.map