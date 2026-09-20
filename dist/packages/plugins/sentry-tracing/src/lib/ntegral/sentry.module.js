"use strict";
var SentryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const sentry_core_module_1 = require("./sentry-core.module");
let SentryModule = SentryModule_1 = class SentryModule {
    /**
     * Static method to create a dynamic module for Sentry integration.
     * @param {SentryModuleOptions} options - Options for configuring the Sentry module.
     * @returns {DynamicModule} A dynamic module configuration.
     */
    static forRoot(options) {
        return {
            module: SentryModule_1,
            imports: [sentry_core_module_1.SentryCoreModule.forRoot(options)],
        };
    }
    /**
     * Static method to create a dynamic module for Sentry integration with asynchronous options.
     * @param {SentryModuleAsyncOptions} options - Asynchronous options for configuring the Sentry module.
     * @returns {DynamicModule} A dynamic module configuration.
     */
    static forRootAsync(options) {
        return {
            module: SentryModule_1,
            imports: [sentry_core_module_1.SentryCoreModule.forRootAsync(options)],
        };
    }
};
exports.SentryModule = SentryModule;
exports.SentryModule = SentryModule = SentryModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], SentryModule);
//# sourceMappingURL=sentry.module.js.map