"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSettingGetHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("./../../../../core/context");
const tenant_setting_get_command_1 = require("../tenant-setting.get.command");
const tenant_setting_service_1 = require("./../../tenant-setting.service");
const decorators_1 = require("./../../../../core/decorators");
const dto_1 = require("./../../dto");
let TenantSettingGetHandler = class TenantSettingGetHandler {
    constructor(_tenantSettingService) {
        this._tenantSettingService = _tenantSettingService;
    }
    /**
     * Executes the retrieval and processing of tenant settings.
     *
     * @returns {Promise<Record<string, any>>} - Returns an object containing the tenant settings with secrets wrapped for various cloud storage providers and monitoring services.
     *
     * @throws {Error} - Throws an error if the operation fails.
     */
    async execute() {
        let settings = await this._tenantSettingService.getSettings({
            where: { tenantId: context_1.RequestContext.currentTenantId() }
        });
        return Object.assign({}, (0, decorators_1.WrapSecrets)(settings, new dto_1.WasabiS3ProviderConfigDTO()), (0, decorators_1.WrapSecrets)(settings, new dto_1.AwsS3ProviderConfigDTO()), (0, decorators_1.WrapSecrets)(settings, new dto_1.CloudinaryProviderConfigDTO()), (0, decorators_1.WrapSecrets)(settings, new dto_1.DigitalOceanS3ProviderConfigDTO()), (0, decorators_1.WrapSecrets)(settings, new dto_1.MonitoringProviderConfigDTO()));
    }
};
exports.TenantSettingGetHandler = TenantSettingGetHandler;
exports.TenantSettingGetHandler = TenantSettingGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_setting_get_command_1.TenantSettingGetCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => tenant_setting_service_1.TenantSettingService))),
    tslib_1.__metadata("design:paramtypes", [tenant_setting_service_1.TenantSettingService])
], TenantSettingGetHandler);
//# sourceMappingURL=tenant-setting.get.handler.js.map