"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstrapModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const plugin_1 = require("@gauzy/plugin");
const logger_1 = require("../logger");
const app_module_1 = require("../app/app.module");
let BootstrapModule = class BootstrapModule {
    /**
     * Configures middleware for the application.
     * This method applies middleware to all routes in the application.
     *
     * @param consumer - An instance of `MiddlewareConsumer` that allows configuring middleware in the app.
     */
    configure(consumer) {
        consumer.apply().forRoutes('*');
    }
    /**
     * Handles cleanup and resource shutdown logic when the application receives a termination signal.
     * This method dynamically shuts down tracing if enabled and logs the shutdown process.
     *
     * @param signal - The signal causing the application shutdown (e.g., SIGTERM).
     */
    async onApplicationShutdown(signal) {
        if (signal) {
            logger_1.Logger.log(`Received shutdown signal: ${signal}`);
            // Check if tracing is enabled through the environment variable
            if (process.env.OTEL_ENABLED === 'true') {
                try {
                    // Dynamically import the tracer module to ensure clean initialization/shutdown
                    const { default: tracer } = await Promise.resolve().then(() => require('./tracer'));
                    if (tracer) {
                        await tracer.shutdown(); // Shutdown the tracer
                    }
                }
                catch (error) {
                    console.error('Error terminating tracing', error);
                }
            }
            // Handle specific signal logic
            if (signal === 'SIGTERM') {
                logger_1.Logger.log('SIGTERM shutting down. Please wait...');
            }
        }
    }
};
exports.BootstrapModule = BootstrapModule;
exports.BootstrapModule = BootstrapModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, logger_1.LoggerModule.forRoot(), plugin_1.PluginModule.init(), app_module_1.AppModule]
    })
], BootstrapModule);
//# sourceMappingURL=bootstrap.module.js.map