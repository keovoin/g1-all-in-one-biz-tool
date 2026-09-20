"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSettingGetHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const tenant_setting_service_1 = require("../../tenant-setting.service");
const global_setting_get_command_1 = require("../global-setting.get.command");
const decorators_1 = require("../../../../core/decorators");
const dto_1 = require("../../dto");
let GlobalSettingGetHandler = class GlobalSettingGetHandler {
    constructor(_tenantSettingService) {
        this._tenantSettingService = _tenantSettingService;
    }
    async execute(command) {
        const settings = await this._tenantSettingService.getGlobalSettings(command.names);
        // Mask secret values before returning to client
        return (0, decorators_1.WrapSecrets)(settings, new dto_1.MonitoringProviderConfigDTO());
    }
};
exports.GlobalSettingGetHandler = GlobalSettingGetHandler;
exports.GlobalSettingGetHandler = GlobalSettingGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(global_setting_get_command_1.GlobalSettingGetCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => tenant_setting_service_1.TenantSettingService))),
    tslib_1.__metadata("design:paramtypes", [tenant_setting_service_1.TenantSettingService])
], GlobalSettingGetHandler);
//# sourceMappingURL=global-setting.get.handler.js.map