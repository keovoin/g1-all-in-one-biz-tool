"use strict";
var UpdatePluginSettingHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginSettingHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const update_plugin_setting_command_1 = require("../update-plugin-setting.command");
let UpdatePluginSettingHandler = UpdatePluginSettingHandler_1 = class UpdatePluginSettingHandler {
    constructor(pluginSettingService, eventBus) {
        this.pluginSettingService = pluginSettingService;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(UpdatePluginSettingHandler_1.name);
    }
    async execute(command) {
        const { id, updateDto, tenantId, organizationId, userId } = command;
        try {
            // Find existing plugin setting
            const existingSetting = await this.pluginSettingService.findOneByIdString(id);
            if (!existingSetting) {
                throw new common_1.NotFoundException(`Plugin setting with ID "${id}" not found`);
            }
            // Verify tenant access
            if (existingSetting.tenantId !== tenantId) {
                throw new common_1.BadRequestException('Access denied to this plugin setting');
            }
            // Prepare update data with proper type conversion
            const settingUpdateData = {
                ...updateDto,
                updatedAt: new Date()
            };
            // Convert validationRules object to JSON string if present
            if (updateDto.validationRules && typeof updateDto.validationRules === 'object') {
                settingUpdateData.validationRules = JSON.stringify(updateDto.validationRules);
            }
            // Update the plugin setting
            await this.pluginSettingService.update(id, settingUpdateData);
            const updatedSetting = await this.pluginSettingService.findOneByIdString(id);
            // Publish event
            this.eventBus.publish(new domain_1.PluginSettingUpdatedEvent(updatedSetting.id, updatedSetting.pluginId, updatedSetting.key, updatedSetting.value, existingSetting.value, // previous value
            tenantId, organizationId, userId));
            this.logger.log(`Plugin setting updated successfully: ${updatedSetting.id}`);
            return updatedSetting;
        }
        catch (error) {
            this.logger.error(`Failed to update plugin setting: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update plugin setting: ${error.message}`);
        }
    }
};
exports.UpdatePluginSettingHandler = UpdatePluginSettingHandler;
exports.UpdatePluginSettingHandler = UpdatePluginSettingHandler = UpdatePluginSettingHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_setting_command_1.UpdatePluginSettingCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService, cqrs_1.EventBus])
], UpdatePluginSettingHandler);
//# sourceMappingURL=update-plugin-setting.handler.js.map