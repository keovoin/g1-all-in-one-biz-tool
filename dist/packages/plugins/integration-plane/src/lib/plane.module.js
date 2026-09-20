"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaneModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const cqrs_1 = require("@nestjs/cqrs");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const plane_controller_1 = require("./plane.controller");
const plane_integration_service_1 = require("./plane-integration.service");
const plane_proxy_service_1 = require("./plane-proxy.service");
let PlaneModule = class PlaneModule {
};
exports.PlaneModule = PlaneModule;
exports.PlaneModule = PlaneModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            cqrs_1.CqrsModule,
            config_1.ConfigModule,
            core_1.IntegrationModule,
            core_1.IntegrationSettingModule,
            core_1.IntegrationTenantModule,
            core_1.TenantApiKeyModule,
            core_1.PluginCommonModule,
            core_1.RolePermissionModule
        ],
        controllers: [plane_controller_1.PlaneController],
        providers: [plane_integration_service_1.PlaneIntegrationService, plane_proxy_service_1.PlaneProxyService],
        exports: [plane_integration_service_1.PlaneIntegrationService, plane_proxy_service_1.PlaneProxyService]
    })
], PlaneModule);
//# sourceMappingURL=plane.module.js.map