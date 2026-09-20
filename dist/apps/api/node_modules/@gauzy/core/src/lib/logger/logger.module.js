"use strict";
var LoggerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const logger_provider_1 = require("./logger.provider");
const logger_1 = require("./logger");
let LoggerModule = LoggerModule_1 = class LoggerModule {
    /**
     * Configures the Logger module for root.
     * @returns {DynamicModule} The dynamically configured module.
     */
    static forRoot() {
        const prefixedLoggerProviders = (0, logger_provider_1.createLoggerProviders)();
        return {
            module: LoggerModule_1,
            providers: [logger_1.Logger, ...prefixedLoggerProviders],
            exports: [logger_1.Logger, ...prefixedLoggerProviders]
        };
    }
};
exports.LoggerModule = LoggerModule;
exports.LoggerModule = LoggerModule = LoggerModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], LoggerModule);
//# sourceMappingURL=logger.module.js.map