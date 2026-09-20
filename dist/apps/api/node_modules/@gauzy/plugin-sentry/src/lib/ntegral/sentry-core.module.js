"use strict";
var SentryCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryCoreModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const sentry_constants_1 = require("./sentry.constants");
const sentry_service_1 = require("./sentry.service");
const sentry_providers_1 = require("./sentry.providers");
let SentryCoreModule = SentryCoreModule_1 = class SentryCoreModule {
    /**
     * Static method to create a dynamic module for Sentry integration.
     * @param {SentryModuleOptions} options - Options for configuring the Sentry module.
     * @returns {DynamicModule} A dynamic module configuration.
     */
    static forRoot(options) {
        const provider = (0, sentry_providers_1.createSentryProviders)(options);
        return {
            exports: [provider, sentry_service_1.SentryService],
            module: SentryCoreModule_1,
            providers: [provider, sentry_service_1.SentryService],
        };
    }
    /**
     * Static method to create a dynamic module for Sentry integration with asynchronous options.
     * @param {SentryModuleAsyncOptions} options - Asynchronous options for configuring the Sentry module.
     * @returns {DynamicModule} A dynamic module configuration.
     */
    static forRootAsync(options) {
        const provider = {
            inject: [sentry_constants_1.SENTRY_MODULE_OPTIONS],
            provide: sentry_constants_1.SENTRY_TOKEN,
            useFactory: (options) => new sentry_service_1.SentryService(options),
        };
        return {
            exports: [provider, sentry_service_1.SentryService],
            imports: options.imports,
            module: SentryCoreModule_1,
            providers: [
                ...this.createAsyncProviders(options),
                provider,
                sentry_service_1.SentryService,
            ],
        };
    }
    /**
     * Static method to create providers for asynchronous options in the Sentry module.
     * @param {SentryModuleAsyncOptions} options - Asynchronous options for configuring the Sentry module.
     * @returns {Provider[]} An array of providers for asynchronous options.
     */
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }
    /**
     * Static method to create an options provider for asynchronous options in the Sentry module.
     * @param {SentryModuleAsyncOptions} options - Asynchronous options for configuring the Sentry module.
     * @returns {Provider} A provider for asynchronous options.
     */
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                inject: options.inject || [],
                provide: sentry_constants_1.SENTRY_MODULE_OPTIONS,
                useFactory: options.useFactory,
            };
        }
        const inject = [
            (options.useClass || options.useExisting),
        ];
        return {
            provide: sentry_constants_1.SENTRY_MODULE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createSentryModuleOptions(),
            inject,
        };
    }
};
exports.SentryCoreModule = SentryCoreModule;
exports.SentryCoreModule = SentryCoreModule = SentryCoreModule_1 = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], SentryCoreModule);
//# sourceMappingURL=sentry-core.module.js.map