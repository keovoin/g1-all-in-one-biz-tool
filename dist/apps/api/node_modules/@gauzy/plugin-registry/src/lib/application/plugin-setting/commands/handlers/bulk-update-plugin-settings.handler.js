"use strict";
var BulkUpdatePluginSettingsHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUpdatePluginSettingsHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const bulk_update_plugin_settings_command_1 = require("../bulk-update-plugin-settings.command");
let BulkUpdatePluginSettingsHandler = BulkUpdatePluginSettingsHandler_1 = class BulkUpdatePluginSettingsHandler {
    constructor(pluginSettingService, eventBus, dataSource) {
        this.pluginSettingService = pluginSettingService;
        this.eventBus = eventBus;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(BulkUpdatePluginSettingsHandler_1.name);
    }
    async execute(command) {
        const { bulkUpdateDto, tenantId, organizationId, userId } = command;
        try {
            const { pluginId, settings, pluginTenantId } = bulkUpdateDto;
            // Validate required fields
            if (!pluginId || !settings || settings.length === 0) {
                throw new common_1.BadRequestException('Plugin ID and settings array are required');
            }
            // Use transaction for bulk operations
            return await this.dataSource.transaction(async (manager) => {
                const updatedSettings = [];
                const changedSettings = [];
                for (const settingUpdate of settings) {
                    const { key, value } = settingUpdate;
                    if (!key) {
                        throw new common_1.BadRequestException('Setting key is required');
                    }
                    // Find existing setting
                    let existingSetting = await this.pluginSettingService.findByKey(pluginId, key, pluginTenantId);
                    const previousValue = existingSetting?.value;
                    if (existingSetting) {
                        // Verify tenant access
                        if (existingSetting.tenantId !== tenantId) {
                            throw new common_1.BadRequestException(`Access denied to plugin setting: ${key}`);
                        }
                        // Update existing setting
                        await this.pluginSettingService.update(existingSetting.id, {
                            value,
                            updatedBy: { id: userId },
                            updatedAt: new Date()
                        });
                        existingSetting = await this.pluginSettingService.findOneByIdString(existingSetting.id);
                        updatedSettings.push(existingSetting);
                    }
                    else {
                        // Create new setting
                        const newSetting = await this.pluginSettingService.create({
                            pluginId,
                            key,
                            value,
                            pluginTenantId,
                            tenantId,
                            organizationId
                        });
                        updatedSettings.push(newSetting);
                    }
                    changedSettings.push({
                        key,
                        newValue: value,
                        oldValue: previousValue
                    });
                }
                // Publish event
                this.eventBus.publish(new domain_1.PluginSettingsBulkUpdatedEvent(pluginId, changedSettings, pluginTenantId, tenantId, organizationId, userId));
                this.logger.log(`Plugin settings bulk updated successfully for plugin: ${pluginId}`);
                return updatedSettings;
            });
        }
        catch (error) {
            this.logger.error(`Failed to bulk update plugin settings: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to bulk update plugin settings: ${error.message}`);
        }
    }
};
exports.BulkUpdatePluginSettingsHandler = BulkUpdatePluginSettingsHandler;
exports.BulkUpdatePluginSettingsHandler = BulkUpdatePluginSettingsHandler = BulkUpdatePluginSettingsHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(bulk_update_plugin_settings_command_1.BulkUpdatePluginSettingsCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSettingService,
        cqrs_1.EventBus,
        typeorm_1.DataSource])
], BulkUpdatePluginSettingsHandler);
//# sourceMappingURL=bulk-update-plugin-settings.handler.js.map