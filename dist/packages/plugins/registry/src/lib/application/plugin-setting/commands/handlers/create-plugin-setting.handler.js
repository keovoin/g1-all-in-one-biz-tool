"use strict";
var CreatePluginSettingHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSettingHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const create_plugin_setting_command_1 = require("../create-plugin-setting.command");
let CreatePluginSettingHandler = CreatePluginSettingHandler_1 = class CreatePluginSettingHandler {
    constructor(pluginSettingService, eventBus) {
        this.pluginSettingService = pluginSettingService;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(CreatePluginSettingHandler_1.name);
    }
    async execute(command) {
        const { createDto, tenantId, organizationId, userId } = command;
        try {
            // Validate required fields
            if (!createDto.pluginId || !createDto.key) {
                throw new common_1.BadRequestException('Plugin ID and key are required');
            }
            // Add tenant context to the DTO
            const settingData = {
                ...createDto,
                tenantId,
                organizationId,
                createdBy: userId,
                // Convert validationRules object to JSON string if present
                validationRules: createDto.validationRules ? JSON.stringify(createDto.validationRules) : undefined
            };
            // Create the plugin setting
            const pluginSetting = await this.pluginSettingService.create(settingData);
            // Publish event
            this.eventBus.publish(new domain_1.PluginSettingCreatedEvent(pluginSetting.id, pluginSetting.pluginId, pluginSetting.key, pluginSetting.value, tenantId, organizationId, userId));
            this.logger.log(`Plugin setting created successfully: ${pluginSetting.id}`);
            return pluginSetting;
        }
        catch (error) {
            this.logger.error(`Failed to create plugin setting: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to create plugin setting: ${error.message}`);
        }
    }
};
exports.CreatePluginSettingHandler = CreatePluginSettingHandler;
exports.CreatePluginSettingHandler = CreatePluginSettingHandler = CreatePluginSettingHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_plugin_setting_command_1.CreatePluginSettingCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService, cqrs_1.EventBus])
], CreatePluginSettingHandler);
//# sourceMappingURL=create-plugin-setting.handler.js.map