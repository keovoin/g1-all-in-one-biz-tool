"use strict";
var SocialAuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@gauzy/config");
const internal_1 = require("./internal");
const social_auth_service_1 = require("./social-auth.service");
let SocialAuthModule = SocialAuthModule_1 = class SocialAuthModule {
    /**
     * Registers the SocialAuthModule asynchronously.
     *
     * @param options - The options used to configure the SocialAuthModule.
     * @returns {DynamicModule} - A dynamically created module with configured providers and imports.
     */
    static registerAsync(options) {
        return {
            module: SocialAuthModule_1,
            providers: [...SocialAuthModule_1.createConnectProviders(options)],
            imports: [...options.imports],
            exports: [...options.imports]
        };
    }
    /**
     * Creates an array of providers for connecting and configuring the SocialAuthService.
     *
     * @param options - The options used to specify the provider configuration.
     * @returns {Provider[]} - An array of providers to be registered in the module.
     */
    static createConnectProviders(options) {
        return [
            {
                provide: social_auth_service_1.SocialAuthService,
                useClass: options.useClass
            }
        ];
    }
};
exports.SocialAuthModule = SocialAuthModule;
exports.SocialAuthModule = SocialAuthModule = SocialAuthModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, axios_1.HttpModule],
        controllers: [...internal_1.Controllers],
        providers: [...internal_1.Strategies, ...internal_1.AuthGuards, social_auth_service_1.SocialAuthService],
        exports: [social_auth_service_1.SocialAuthService]
    })
], SocialAuthModule);
//# sourceMappingURL=social-auth.module.js.map