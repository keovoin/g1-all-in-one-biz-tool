"use strict";
var PosthogPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosthogPlugin = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const plugin_1 = require("@gauzy/plugin");
const posthog_module_1 = require("./posthog.module");
const posthog_interfaces_1 = require("./posthog.interfaces");
const posthog_event_interceptor_1 = require("./posthog-event.interceptor");
const posthog_error_interceptor_1 = require("./posthog-error.interceptor");
const posthog_request_middleware_1 = require("./posthog-request.middleware");
const posthog_trace_middleware_1 = require("./posthog-trace.middleware");
const posthog_constants_1 = require("./posthog.constants");
let PosthogPlugin = PosthogPlugin_1 = class PosthogPlugin {
    constructor() {
        this.logEnabled = true;
    }
    /**
     * Configures PostHog middlewares for all routes
     * @param consumer The middleware consumer
     */
    configure(consumer) {
        if (this.shouldEnableTracking()) {
            consumer.apply(posthog_request_middleware_1.PosthogRequestMiddleware).forRoutes('*').apply(posthog_trace_middleware_1.PosthogTraceMiddleware).forRoutes('*');
        }
    }
    /**
     * Called when plugin is initialized
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log('🚀 PostHog plugin initialized');
        }
    }
    /**
     * Called when plugin is destroyed
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log('🛑 PostHog plugin destroyed');
        }
    }
    /**
     * Initialize plugin with options
     * @param options PostHog configuration options
     * @returns The plugin instance
     */
    static init(options) {
        PosthogPlugin_1.options = (0, posthog_interfaces_1.parsePosthogOptions)(options);
        return PosthogPlugin_1;
    }
    /**
     * Determines if tracking should be enabled
     * @returns boolean indicating if tracking is enabled
     */
    shouldEnableTracking() {
        return !PosthogPlugin_1.options.mock && !!PosthogPlugin_1.options.apiKey;
    }
};
exports.PosthogPlugin = PosthogPlugin;
exports.PosthogPlugin = PosthogPlugin = PosthogPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [
            posthog_module_1.PosthogModule.forRootAsync({
                useFactory: () => (0, posthog_interfaces_1.parsePosthogOptions)(PosthogPlugin.options),
                inject: []
            })
        ],
        providers: [
            {
                provide: posthog_constants_1.POSTHOG_MODULE_OPTIONS,
                useValue: PosthogPlugin.options
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: posthog_error_interceptor_1.PosthogErrorInterceptor
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: posthog_event_interceptor_1.PosthogEventInterceptor
            }
        ]
    })
], PosthogPlugin);
//# sourceMappingURL=posthog.plugin.js.map