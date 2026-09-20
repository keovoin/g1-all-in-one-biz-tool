"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalSettingSaveHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const tenant_setting_service_1 = require("../../tenant-setting.service");
const global_setting_save_command_1 = require("../global-setting.save.command");
let GlobalSettingSaveHandler = class GlobalSettingSaveHandler {
    constructor(_tenantSettingService) {
        this._tenantSettingService = _tenantSettingService;
    }
    async execute(command) {
        return this._tenantSettingService.saveGlobalSettings(command.input);
    }
};
exports.GlobalSettingSaveHandler = GlobalSettingSaveHandler;
exports.GlobalSettingSaveHandler = GlobalSettingSaveHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(global_setting_save_command_1.GlobalSettingSaveCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => tenant_setting_service_1.TenantSettingService))),
    tslib_1.__metadata("design:paramtypes", [tenant_setting_service_1.TenantSettingService])
], GlobalSettingSaveHandler);
//# sourceMappingURL=global-setting.save.handler.js.map