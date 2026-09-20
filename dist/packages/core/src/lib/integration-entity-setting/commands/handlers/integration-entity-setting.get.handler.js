"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const integration_entity_setting_get_command_1 = require("./../integration-entity-setting.get.command");
const integration_entity_setting_service_1 = require("./../../integration-entity-setting.service");
let IntegrationEntitySettingGetHandler = class IntegrationEntitySettingGetHandler {
    constructor(_integrationEntitySettingService) {
        this._integrationEntitySettingService = _integrationEntitySettingService;
    }
    /**
     * Execute the get command for integration entity settings.
     *
     * @param command - The IntegrationEntitySettingGetCommand containing the integrationId.
     * @returns A promise resolving to paginated integration entity settings.
     */
    async execute(command) {
        const { integrationId } = command;
        return await this._integrationEntitySettingService.getIntegrationEntitySettings(integrationId);
    }
};
exports.IntegrationEntitySettingGetHandler = IntegrationEntitySettingGetHandler;
exports.IntegrationEntitySettingGetHandler = IntegrationEntitySettingGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_entity_setting_get_command_1.IntegrationEntitySettingGetCommand),
    tslib_1.__metadata("design:paramtypes", [integration_entity_setting_service_1.IntegrationEntitySettingService])
], IntegrationEntitySettingGetHandler);
//# sourceMappingURL=integration-entity-setting.get.handler.js.map