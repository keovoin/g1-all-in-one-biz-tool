"use strict";
var PosthogModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const posthog_core_module_1 = require("./posthog-core.module");
/**
 * Entry module for PostHog integration.
 */
let PosthogModule = PosthogModule_1 = class PosthogModule {
    /**
     * Static method to create a dynamic module with synchronous configuration.
     */
    static forRoot(options) {
        return {
            module: PosthogModule_1,
            imports: [posthog_core_module_1.PosthogCoreModule.forRoot(options)]
        };
    }
    /**
     * Static method to create a dynamic module with asynchronous configuration.
     */
    static forRootAsync(options) {
        return {
            module: PosthogModule_1,
            imports: [posthog_core_module_1.PosthogCoreModule.forRootAsync(options)]
        };
    }
};
exports.PosthogModule = PosthogModule;
exports.PosthogModule = PosthogModule = PosthogModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], PosthogModule);
//# sourceMappingURL=posthog.module.js.map