"use strict";
var DeletePluginSettingHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginSettingHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const delete_plugin_setting_command_1 = require("../delete-plugin-setting.command");
let DeletePluginSettingHandler = DeletePluginSettingHandler_1 = class DeletePluginSettingHandler {
    constructor(pluginSettingService, eventBus) {
        this.pluginSettingService = pluginSettingService;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(DeletePluginSettingHandler_1.name);
    }
    async execute(command) {
        const { id, tenantId, organizationId, userId } = command;
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
            // Delete the plugin setting
            await this.pluginSettingService.delete(id);
            // Publish event
            this.eventBus.publish(new domain_1.PluginSettingDeletedEvent(existingSetting.id, existingSetting.pluginId, existingSetting.key, existingSetting.value, tenantId, organizationId, userId));
            this.logger.log(`Plugin setting deleted successfully: ${id}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete plugin setting: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete plugin setting: ${error.message}`);
        }
    }
};
exports.DeletePluginSettingHandler = DeletePluginSettingHandler;
exports.DeletePluginSettingHandler = DeletePluginSettingHandler = DeletePluginSettingHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_plugin_setting_command_1.DeletePluginSettingCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService, cqrs_1.EventBus])
], DeletePluginSettingHandler);
//# sourceMappingURL=delete-plugin-setting.handler.js.map