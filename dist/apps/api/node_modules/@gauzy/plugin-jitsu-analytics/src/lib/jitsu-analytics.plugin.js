"use strict";
var JitsuAnalyticsPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitsuAnalyticsPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const jitsu_types_1 = require("./jitsu.types");
const jitsu_helper_1 = require("./jitsu-helper");
const jitsu_analytics_service_1 = require("./jitsu-analytics.service");
const jitsu_events_subscriber_1 = require("./jitsu-events.subscriber");
let JitsuAnalyticsPlugin = JitsuAnalyticsPlugin_1 = class JitsuAnalyticsPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${JitsuAnalyticsPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${JitsuAnalyticsPlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Create a dynamic module for configuring and initializing the Jitsu Analytics module.
     * @param options The options for configuring the Jitsu Analytics module.
     * @returns A dynamic module definition.
     */
    static init(options) {
        // Assuming `parseOptions` is defined
        this.options = (0, jitsu_helper_1.parseOptions)(options);
        return {
            global: options.isGlobal ?? true,
            module: JitsuAnalyticsPlugin_1,
            providers: [
                jitsu_analytics_service_1.JitsuAnalyticsService,
                {
                    provide: jitsu_types_1.JITSU_MODULE_PROVIDER_CONFIG,
                    useFactory: () => options.config
                }
            ],
            exports: [jitsu_analytics_service_1.JitsuAnalyticsService]
        };
    }
};
exports.JitsuAnalyticsPlugin = JitsuAnalyticsPlugin;
JitsuAnalyticsPlugin.options = {};
exports.JitsuAnalyticsPlugin = JitsuAnalyticsPlugin = JitsuAnalyticsPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        providers: [
            jitsu_analytics_service_1.JitsuAnalyticsService,
            {
                provide: jitsu_types_1.JITSU_MODULE_PROVIDER_CONFIG,
                useFactory: () => JitsuAnalyticsPlugin.options?.config
            }
        ],
        subscribers: [jitsu_events_subscriber_1.JitsuEventsSubscriber]
    })
], JitsuAnalyticsPlugin);
//# sourceMappingURL=jitsu-analytics.plugin.js.map