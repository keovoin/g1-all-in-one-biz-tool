"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantUiPreferencesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../core/context");
const decorators_1 = require("../../shared/decorators");
const pipes_1 = require("../../shared/pipes");
const guards_1 = require("../../shared/guards");
const tenant_setting_service_1 = require("./tenant-setting.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
/**
 * Tenant-wide UI preferences (currently: Angular vs React for the pages that ship in both).
 *
 * Deliberately a separate controller from `TenantSettingController`: that one is gated by
 * `TENANT_SETTING` as a whole, but the preference must be READABLE by every signed-in user of the
 * tenant (the dashboard picks the flavour to render from it), while only administrators may
 * CHANGE it. The values are resolved straight from the service — never from the request-scoped
 * settings cache — so a save is visible on the very next request.
 */
let TenantUiPreferencesController = class TenantUiPreferencesController {
    constructor(tenantSettingService, commandBus) {
        this.tenantSettingService = tenantSettingService;
        this.commandBus = commandBus;
    }
    async getUiPreferences() {
        const tenantId = context_1.RequestContext.currentTenantId();
        const resolved = await this.tenantSettingService.getResolvedSettings([contracts_1.PREFERRED_UI_SETTING_KEY], tenantId);
        return { preferredUi: normalizePreferredUi(resolved[contracts_1.PREFERRED_UI_SETTING_KEY]) };
    }
    async updateUiPreferences(input) {
        const update = input;
        if (update.preferredUi) {
            // `ITenantSetting` only types the file-storage keys; every other tenant setting (the
            // monitoring keys, this one) travels through the same key/value store untyped.
            const setting = { [contracts_1.PREFERRED_UI_SETTING_KEY]: update.preferredUi };
            await this.commandBus.execute(new commands_1.TenantSettingSaveCommand(setting));
        }
        return this.getUiPreferences();
    }
};
exports.TenantUiPreferencesController = TenantUiPreferencesController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the tenant-wide UI preferences (any signed-in user of the tenant).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'UI preferences retrieved successfully.' }),
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TenantUiPreferencesController.prototype, "getUiPreferences", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update the tenant-wide UI preferences (tenant administrators).' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'UI preferences saved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TENANT_SETTING),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    (0, common_1.Put)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UiPreferencesConfigDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantUiPreferencesController.prototype, "updateUiPreferences", null);
exports.TenantUiPreferencesController = TenantUiPreferencesController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TenantSetting'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/tenant-ui-preferences'),
    tslib_1.__metadata("design:paramtypes", [tenant_setting_service_1.TenantSettingService, cqrs_1.CommandBus])
], TenantUiPreferencesController);
/**
 * Anything that is not a known {@link PreferredUiEnum} value (an unset row, a stale value from
 * an older build) resolves to Angular — the flavour that always exists.
 */
function normalizePreferredUi(value) {
    return Object.values(contracts_1.PreferredUiEnum).includes(value)
        ? value
        : contracts_1.PreferredUiEnum.ANGULAR;
}
//# sourceMappingURL=tenant-ui-preferences.controller.js.map