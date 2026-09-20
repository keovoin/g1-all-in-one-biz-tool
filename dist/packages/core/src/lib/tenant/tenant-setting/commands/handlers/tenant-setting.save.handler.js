"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSettingSaveHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../../../../core/context");
const tenant_setting_service_1 = require("./../../tenant-setting.service");
const tenant_setting_save_command_1 = require("../tenant-setting.save.command");
let TenantSettingSaveHandler = class TenantSettingSaveHandler {
    constructor(_tenantSettingService) {
        this._tenantSettingService = _tenantSettingService;
    }
    /**
     * Executes a command to save tenant settings. Delegates to _tenantSettingService,
     * using the current tenant ID from RequestContext or the one provided in the command.
     *
     * @param command A TenantSettingSaveCommand object with settings and tenant ID.
     * @returns The result of the save operation from _tenantSettingService.
     */
    async execute(command) {
        const tenantId = context_1.RequestContext.currentTenantId() ?? command.tenantId;
        if (!tenantId) {
            throw new Error('Tenant ID is required to save tenant settings.');
        }
        return this._tenantSettingService.saveSettings(command.input, tenantId);
    }
};
exports.TenantSettingSaveHandler = TenantSettingSaveHandler;
exports.TenantSettingSaveHandler = TenantSettingSaveHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_setting_save_command_1.TenantSettingSaveCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => tenant_setting_service_1.TenantSettingService))),
    tslib_1.__metadata("design:paramtypes", [tenant_setting_service_1.TenantSettingService])
], TenantSettingSaveHandler);
//# sourceMappingURL=tenant-setting.save.handler.js.map