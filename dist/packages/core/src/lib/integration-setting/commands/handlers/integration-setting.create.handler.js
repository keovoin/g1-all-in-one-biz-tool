"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const __1 = require("..");
const integration_setting_service_1 = require("../../integration-setting.service");
const context_1 = require("../../../core/context");
let IntegrationSettingCreateHandler = class IntegrationSettingCreateHandler {
    constructor(integrationSettingService) {
        this.integrationSettingService = integrationSettingService;
    }
    async execute(command) {
        const { input } = command;
        const tenantId = context_1.RequestContext.currentTenantId();
        return await this.integrationSettingService.create(Object.assign(input, { tenantId }));
    }
};
exports.IntegrationSettingCreateHandler = IntegrationSettingCreateHandler;
exports.IntegrationSettingCreateHandler = IntegrationSettingCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(__1.IntegrationSettingCreateCommand),
    tslib_1.__metadata("design:paramtypes", [integration_setting_service_1.IntegrationSettingService])
], IntegrationSettingCreateHandler);
//# sourceMappingURL=integration-setting.create.handler.js.map