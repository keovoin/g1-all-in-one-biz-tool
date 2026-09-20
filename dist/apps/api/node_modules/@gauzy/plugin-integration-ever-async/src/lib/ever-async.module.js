"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverAsyncModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const ever_async_connector_controller_1 = require("./ever-async-connector.controller");
const ever_async_rate_limit_guard_1 = require("./ever-async-rate-limit.guard");
const ever_async_controller_1 = require("./ever-async.controller");
const ever_async_integration_service_1 = require("./ever-async-integration.service");
let EverAsyncModule = class EverAsyncModule {
};
exports.EverAsyncModule = EverAsyncModule;
exports.EverAsyncModule = EverAsyncModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule,
            core_1.IntegrationModule,
            core_1.IntegrationSettingModule,
            core_1.IntegrationTenantModule,
            core_1.PluginCommonModule,
            core_1.RolePermissionModule
        ],
        controllers: [ever_async_controller_1.EverAsyncController, ever_async_connector_controller_1.EverAsyncConnectorController],
        providers: [ever_async_integration_service_1.EverAsyncIntegrationService, ever_async_connector_controller_1.EverAsyncConnectorGuard, ever_async_rate_limit_guard_1.EverAsyncRateLimitGuard],
        exports: [ever_async_integration_service_1.EverAsyncIntegrationService]
    })
], EverAsyncModule);
//# sourceMappingURL=ever-async.module.js.map