"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingGetManyHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const integration_setting_getMany_command_1 = require("./../integration-setting.getMany.command");
const context_1 = require("../../../core/context");
const integration_setting_service_1 = require("../../integration-setting.service");
let IntegrationSettingGetManyHandler = class IntegrationSettingGetManyHandler {
    constructor(_integrationSettingService) {
        this._integrationSettingService = _integrationSettingService;
    }
    /**
     * Executes a command to retrieve multiple integration settings.
     *
     * @param command - The command to execute for retrieving integration settings.
     * @returns A Promise that resolves to an array of integration settings.
     */
    async execute(command) {
        // Extract the input parameters from the command
        const { input } = command;
        // Get the current tenant ID from the RequestContext
        const tenantId = context_1.RequestContext.currentTenantId();
        // Append the tenant ID to the 'where' clause if it's an object AND there is a request tenant.
        // Webhook callers (GitHub Probot installation.deleted) run without a request context and look
        // settings up by installation id across tenants; a null tenantId must not enter the where.
        if (input.where instanceof Object && tenantId) {
            input.where = Object.assign(input.where, { tenantId });
        }
        // Retrieve the integration settings
        const { items } = await this._integrationSettingService.findAll(input);
        return items;
    }
};
exports.IntegrationSettingGetManyHandler = IntegrationSettingGetManyHandler;
exports.IntegrationSettingGetManyHandler = IntegrationSettingGetManyHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_setting_getMany_command_1.IntegrationSettingGetManyCommand),
    tslib_1.__metadata("design:paramtypes", [integration_setting_service_1.IntegrationSettingService])
], IntegrationSettingGetManyHandler);
//# sourceMappingURL=integration-setting.getMany.handler.js.map