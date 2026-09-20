"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingUpdateOrCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const integration_entity_setting_update_or_create_command_1 = require("../integration-entity-setting-update-or-create.command");
const integration_entity_setting_service_1 = require("../../integration-entity-setting.service");
const integration_tenant_service_1 = require("../../../integration-tenant/integration-tenant.service");
let IntegrationEntitySettingUpdateOrCreateHandler = class IntegrationEntitySettingUpdateOrCreateHandler {
    constructor(_integrationEntitySettingService, _integrationTenantService) {
        this._integrationEntitySettingService = _integrationEntitySettingService;
        this._integrationTenantService = _integrationTenantService;
    }
    /**
     * Execute the update command for integration entity settings.
     *
     * @param command - The IntegrationEntitySettingUpdateOrCreateCommand containing the input and integrationId.
     * @returns A promise resolving to an array of updated or created integration entity settings.
     */
    async execute(command) {
        const { input, integrationId } = command;
        await this._integrationTenantService.findOneByIdString(integrationId);
        return await this._integrationEntitySettingService.bulkUpdateOrCreate(input);
    }
};
exports.IntegrationEntitySettingUpdateOrCreateHandler = IntegrationEntitySettingUpdateOrCreateHandler;
exports.IntegrationEntitySettingUpdateOrCreateHandler = IntegrationEntitySettingUpdateOrCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_entity_setting_update_or_create_command_1.IntegrationEntitySettingUpdateOrCreateCommand),
    tslib_1.__metadata("design:paramtypes", [integration_entity_setting_service_1.IntegrationEntitySettingService,
        integration_tenant_service_1.IntegrationTenantService])
], IntegrationEntitySettingUpdateOrCreateHandler);
//# sourceMappingURL=integration-entity-setting-update-or-create.handler.js.map