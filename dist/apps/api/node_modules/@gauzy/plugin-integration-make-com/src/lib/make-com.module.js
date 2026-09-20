"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@gauzy/config");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const make_com_controller_1 = require("./make-com.controller");
const make_com_authorization_controller_1 = require("./make-com-authorization.controller");
const make_com_api_controller_1 = require("./make-com-api.controller");
const make_com_middleware_1 = require("./make-com.middleware");
const make_com_service_1 = require("./make-com.service");
const webhook_service_1 = require("./webhook.service");
const handlers_1 = require("./handlers");
const make_com_oauth_service_1 = require("./make-com-oauth.service");
const make_com_api_service_1 = require("./make-com-api.service");
let MakeComModule = class MakeComModule {
    /**
     * Configures the middleware for the MakeCom module.
     *
     * @param consumer - The MiddlewareConsumer instance used to apply middleware.
     */
    configure(consumer) {
        consumer.apply(make_com_middleware_1.MakeComMiddleware).forRoutes({
            path: '/integration/make-com/oauth-settings',
            method: common_1.RequestMethod.POST
        }, {
            path: '/integration/make-com/oauth-config',
            method: common_1.RequestMethod.GET
        }, {
            path: '/integration/make-com',
            method: common_1.RequestMethod.GET
        }, {
            path: '/integration/make-com',
            method: common_1.RequestMethod.POST
        }, 
        // Make.com API proxy routes
        {
            path: '/integration/make-com/api/*',
            method: common_1.RequestMethod.ALL
        });
    }
};
exports.MakeComModule = MakeComModule;
exports.MakeComModule = MakeComModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule,
            cqrs_1.CqrsModule,
            core_1.RolePermissionModule,
            core_1.IntegrationModule,
            core_1.IntegrationSettingModule,
            core_1.IntegrationTenantModule,
            core_1.UserModule
        ],
        controllers: [make_com_controller_1.MakeComController, make_com_authorization_controller_1.MakeComAuthorizationController, make_com_api_controller_1.MakeComApiController],
        providers: [webhook_service_1.WebhookService, make_com_service_1.MakeComService, make_com_oauth_service_1.MakeComOAuthService, make_com_api_service_1.MakeComApiService, ...handlers_1.EventHandlers],
        exports: [webhook_service_1.WebhookService, make_com_service_1.MakeComService, make_com_oauth_service_1.MakeComOAuthService, make_com_api_service_1.MakeComApiService]
    })
], MakeComModule);
//# sourceMappingURL=make-com.module.js.map