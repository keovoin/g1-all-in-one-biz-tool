"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../../../core/context");
const integration_setting_get_command_1 = require("./../integration-setting.get.command");
const integration_setting_service_1 = require("../../integration-setting.service");
let IntegrationSettingGetHandler = class IntegrationSettingGetHandler {
    constructor(integrationSettingService) {
        this.integrationSettingService = integrationSettingService;
    }
    /**
     * Executes the 'IntegrationSettingGetCommand' to retrieve an integration setting.
     *
     * @param command - The 'IntegrationSettingGetCommand' containing the input for the query.
     * @returns A promise that resolves to an 'IIntegrationSetting' object.
     */
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        // Scope to the request's tenant when there is one. Webhook callers (e.g. the GitHub Probot
        // hooks) run without a request context: their lookup is keyed on the installation id and is
        // legitimately cross-tenant, so a null tenantId must not be written into the where (it used to
        // be dropped by TypeORM; now null means IS NULL and would match nothing).
        if (input.where instanceof Object && tenantId) {
            input.where = Object.assign(input.where, { tenantId });
        }
        const { record } = await this.integrationSettingService.findOneOrFailByOptions(input);
        return record;
    }
};
exports.IntegrationSettingGetHandler = IntegrationSettingGetHandler;
exports.IntegrationSettingGetHandler = IntegrationSettingGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_setting_get_command_1.IntegrationSettingGetCommand),
    tslib_1.__metadata("design:paramtypes", [integration_setting_service_1.IntegrationSettingService])
], IntegrationSettingGetHandler);
//# sourceMappingURL=integration-setting.get.handler.js.map