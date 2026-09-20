"use strict";
var PosthogCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogCoreModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const posthog_constants_1 = require("./posthog.constants");
const posthog_service_1 = require("./posthog.service");
const posthog_config_service_1 = require("./posthog-config.service");
const posthog_providers_1 = require("./posthog.providers");
let PosthogCoreModule = PosthogCoreModule_1 = class PosthogCoreModule {
    /**
     * Synchronous registration of the Posthog module
     * @param options - Configuration object for Posthog
     * @returns A dynamic module with providers and exports
     */
    static forRoot(options) {
        const provider = (0, posthog_providers_1.createPosthogProviders)(options);
        return {
            module: PosthogCoreModule_1,
            imports: [core_1.TenantSettingModule],
            providers: [provider, posthog_service_1.PosthogService, posthog_config_service_1.PosthogConfigService],
            exports: [provider, posthog_service_1.PosthogService, posthog_config_service_1.PosthogConfigService]
        };
    }
    /**
     * Asynchronous registration of the Posthog module
     * Supports useFactory, useClass, or useExisting strategies
     * @param options - Async module options including factory or class
     * @returns A dynamic module with async providers and exports
     */
    static forRootAsync(options) {
        const provider = {
            provide: posthog_constants_1.POSTHOG_TOKEN,
            useFactory: (options) => new posthog_service_1.PosthogService(options),
            inject: [posthog_constants_1.POSTHOG_MODULE_OPTIONS]
        };
        return {
            module: PosthogCoreModule_1,
            imports: [core_1.TenantSettingModule, ...(options.imports || [])],
            providers: [
                ...PosthogCoreModule_1.createAsyncProviders(options),
                provider,
                posthog_service_1.PosthogService,
                posthog_config_service_1.PosthogConfigService
            ],
            exports: [provider, posthog_service_1.PosthogService, posthog_config_service_1.PosthogConfigService]
        };
    }
    /**
     * Creates async providers based on the chosen async strategy
     * @param options - Configuration for async provider setup
     * @returns An array of providers to be used in the async module
     */
    static createAsyncProviders(options) {
        // If a factory function is provided directly
        if (options.useFactory) {
            return [
                {
                    provide: posthog_constants_1.POSTHOG_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || []
                }
            ];
        }
        // Dependency injection array for useClass or useExisting
        if (!options.useClass && !options.useExisting) {
            throw new Error('Either useClass or useExisting must be provided for PosthogModule async configuration');
        }
        const inject = [(options.useClass || options.useExisting)];
        const providers = [
            {
                provide: posthog_constants_1.POSTHOG_MODULE_OPTIONS,
                useFactory: async (factory) => await factory.createPosthogOptions(),
                inject
            }
        ];
        // Register useClass as a provider if defined
        if (options.useClass) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass
            });
        }
        return providers;
    }
};
exports.PosthogCoreModule = PosthogCoreModule;
exports.PosthogCoreModule = PosthogCoreModule = PosthogCoreModule_1 = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], PosthogCoreModule);
//# sourceMappingURL=posthog-core.module.js.map