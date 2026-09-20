"use strict";
var SentryPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryPlugin = exports.DefaultSentryIntegrations = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const sentry_request_middleware_1 = require("./sentry-request.middleware");
const sentry_trace_middleware_1 = require("./sentry-trace.middleware");
const sentry_custom_interceptor_1 = require("./sentry-custom.interceptor");
const ntegral_1 = require("./ntegral");
const sentry_helper_1 = require("./sentry.helper");
// Assuming createDefaultSentryIntegrations returns an array of Integrations
exports.DefaultSentryIntegrations = (0, sentry_helper_1.createDefaultSentryIntegrations)();
let SentryPlugin = SentryPlugin_1 = class SentryPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Configures Sentry middleware for all routes
     * @param consumer The middleware consumer
     */
    configure(consumer) {
        if (process.env.SENTRY_DSN) {
            consumer.apply(sentry_request_middleware_1.SentryRequestMiddleware).forRoutes('*');
            consumer.apply(sentry_trace_middleware_1.SentryTraceMiddleware).forRoutes('*');
        }
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${SentryPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.green(`${SentryPlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Initializes the Sentry module with options
     * @param options Sentry module options
     * @returns The initialized Sentry module
     */
    static init(options) {
        this.options = (0, sentry_helper_1.parseOptions)(options);
        return this;
    }
};
exports.SentryPlugin = SentryPlugin;
SentryPlugin.options = {};
exports.SentryPlugin = SentryPlugin = SentryPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [
            ntegral_1.SentryModule.forRootAsync({
                useFactory: createSentryOptions,
                inject: [core_1.HttpAdapterHost]
            })
        ],
        providers: [
            {
                provide: ntegral_1.SENTRY_MODULE_OPTIONS,
                useFactory: createSentryOptions,
                inject: [core_1.HttpAdapterHost]
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useFactory: () => new sentry_custom_interceptor_1.SentryCustomInterceptor()
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useFactory: () => new ntegral_1.GraphqlInterceptor()
            }
        ]
    })
], SentryPlugin);
/**
 * Creates Sentry module options based on the provided host.
 * @param {HttpAdapterHost} host - The host object from the NestJS framework.
 * @returns {SentryPluginOptions} The Sentry plugin options.
 */
function createSentryOptions(host) {
    // Concatenate the integrations returned by createSentryIntegrations with the existing integrations
    SentryPlugin.options.integrations = (0, sentry_helper_1.removeDuplicateIntegrations)((SentryPlugin.options.integrations ?? []).concat(exports.DefaultSentryIntegrations));
    // Return the Sentry module options
    return SentryPlugin.options;
}
//# sourceMappingURL=sentry.plugin.js.map