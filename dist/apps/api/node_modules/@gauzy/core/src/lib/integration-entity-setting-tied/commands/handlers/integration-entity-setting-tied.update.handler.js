"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingTiedUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const integration_entity_setting_tied_service_1 = require("./../../integration-entity-setting-tied.service");
const integration_entity_setting_tied_update_command_1 = require("../integration-entity-setting-tied.update.command");
const integration_tenant_service_1 = require("./../../../integration-tenant/integration-tenant.service");
let IntegrationEntitySettingTiedUpdateHandler = class IntegrationEntitySettingTiedUpdateHandler {
    constructor(_integrationEntitySettingTiedService, _integrationTenantService) {
        this._integrationEntitySettingTiedService = _integrationEntitySettingTiedService;
        this._integrationTenantService = _integrationTenantService;
    }
    async execute(command) {
        const { input, integrationId } = command;
        await this._integrationTenantService.findOneByIdString(integrationId);
        return await this._integrationEntitySettingTiedService.bulkUpdateOrCreate(input);
    }
};
exports.IntegrationEntitySettingTiedUpdateHandler = IntegrationEntitySettingTiedUpdateHandler;
exports.IntegrationEntitySettingTiedUpdateHandler = IntegrationEntitySettingTiedUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_entity_setting_tied_update_command_1.IntegrationEntitySettingTiedUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [integration_entity_setting_tied_service_1.IntegrationEntitySettingTiedService,
        integration_tenant_service_1.IntegrationTenantService])
], IntegrationEntitySettingTiedUpdateHandler);
//# sourceMappingURL=integration-entity-setting-tied.update.handler.js.map