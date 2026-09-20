"use strict";
var SetPluginSettingValueHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPluginSettingValueHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const set_plugin_setting_value_command_1 = require("../set-plugin-setting-value.command");
let SetPluginSettingValueHandler = SetPluginSettingValueHandler_1 = class SetPluginSettingValueHandler {
    constructor(pluginSettingService, eventBus) {
        this.pluginSettingService = pluginSettingService;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(SetPluginSettingValueHandler_1.name);
    }
    async execute(command) {
        const { setValueDto, tenantId, organizationId, userId } = command;
        try {
            const { pluginId, key, value, pluginTenantId } = setValueDto;
            // Validate required fields
            if (!pluginId || !key) {
                throw new common_1.BadRequestException('Plugin ID and key are required');
            }
            // Find existing setting or create new one
            let pluginSetting = await this.pluginSettingService.findByKey(pluginId, key, pluginTenantId);
            const previousValue = pluginSetting?.value;
            if (pluginSetting) {
                // Verify tenant access
                if (pluginSetting.tenantId !== tenantId) {
                    throw new common_1.BadRequestException('Access denied to this plugin setting');
                }
                // Update existing setting
                await this.pluginSettingService.update(pluginSetting.id, {
                    value,
                    updatedAt: new Date()
                });
                pluginSetting = await this.pluginSettingService.findOneByIdString(pluginSetting.id);
            }
            else {
                // Create new setting
                pluginSetting = await this.pluginSettingService.create({
                    pluginId,
                    key,
                    value,
                    pluginTenantId,
                    tenantId,
                    organizationId
                });
            }
            // Publish event
            this.eventBus.publish(new domain_1.PluginSettingValueSetEvent(pluginSetting.id, pluginSetting.pluginId, pluginSetting.key, pluginSetting.value, previousValue, tenantId, organizationId, userId));
            this.logger.log(`Plugin setting value set successfully: ${pluginSetting.id}`);
            return pluginSetting;
        }
        catch (error) {
            this.logger.error(`Failed to set plugin setting value: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to set plugin setting value: ${error.message}`);
        }
    }
};
exports.SetPluginSettingValueHandler = SetPluginSettingValueHandler;
exports.SetPluginSettingValueHandler = SetPluginSettingValueHandler = SetPluginSettingValueHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(set_plugin_setting_value_command_1.SetPluginSettingValueCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService, cqrs_1.EventBus])
], SetPluginSettingValueHandler);
//# sourceMappingURL=set-plugin-setting-value.handler.js.map