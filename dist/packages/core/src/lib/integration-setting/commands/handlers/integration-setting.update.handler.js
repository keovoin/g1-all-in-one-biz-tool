"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const integration_setting_update_command_1 = require("../integration-setting.update.command");
const integration_setting_service_1 = require("../../integration-setting.service");
let IntegrationSettingUpdateHandler = class IntegrationSettingUpdateHandler {
    constructor(_integrationSettingService) {
        this._integrationSettingService = _integrationSettingService;
    }
    /**
     * Execute the IntegrationSettingUpdateCommand to bulk update or create integration settings.
     *
     * @param command - The IntegrationSettingUpdateCommand containing the input settings and integration ID.
     * @returns {Promise<IIntegrationSetting[]>} - A promise that resolves with an array of updated or created integration settings.
     */
    async execute(command) {
        try {
            const { input, integrationId } = command;
            // Call the service method to bulk update or create integration settings
            return await this._integrationSettingService.bulkUpdateOrCreate(integrationId, input);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            console.log(`Failed to update integration settings: ${error.message}`);
            throw new common_1.HttpException(`Failed to update integration settings: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.IntegrationSettingUpdateHandler = IntegrationSettingUpdateHandler;
exports.IntegrationSettingUpdateHandler = IntegrationSettingUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_setting_update_command_1.IntegrationSettingUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [integration_setting_service_1.IntegrationSettingService])
], IntegrationSettingUpdateHandler);
//# sourceMappingURL=integration-setting.update.handler.js.map