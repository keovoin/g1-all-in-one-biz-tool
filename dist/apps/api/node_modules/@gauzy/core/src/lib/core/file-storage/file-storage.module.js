"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tenant_setting_module_1 = require("../../tenant/tenant-setting/tenant-setting.module");
const tenant_settings_middleware_1 = require("../../tenant/tenant-setting/tenant-settings.middleware");
let FileStorageModule = class FileStorageModule {
    /**
     * Configures middleware for the application.
     *
     * @param {MiddlewareConsumer} consumer - The NestJS `MiddlewareConsumer` instance used to apply middleware.
     *
     * @description
     * This method applies the `TenantSettingsMiddleware` to all routes (`'*'`).
     * The middleware will be executed for every incoming request, allowing tenant-specific settings
     * to be processed before handling requests.
     */
    configure(consumer) {
        consumer.apply(tenant_settings_middleware_1.TenantSettingsMiddleware).forRoutes('*');
    }
};
exports.FileStorageModule = FileStorageModule;
exports.FileStorageModule = FileStorageModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [tenant_setting_module_1.TenantSettingModule],
        providers: [tenant_settings_middleware_1.TenantSettingsMiddleware]
    })
], FileStorageModule);
//# sourceMappingURL=file-storage.module.js.map