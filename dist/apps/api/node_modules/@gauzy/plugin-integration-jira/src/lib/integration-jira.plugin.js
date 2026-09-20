"use strict";
var IntegrationJiraPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationJiraPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
const plugin_1 = require("@gauzy/plugin");
const jira_module_1 = require("./jira.module");
const jira_helpers_1 = require("./jira.helpers");
const { jira } = config_1.environment;
let IntegrationJiraPlugin = IntegrationJiraPlugin_1 = class IntegrationJiraPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationJiraPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationJiraPlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Initializes the Sentry module with options
     * @param options Sentry module options
     * @returns The initialized Sentry module
     */
    static init(options) {
        this.options = (0, jira_helpers_1.parseOptions)(options);
        return this;
    }
};
exports.IntegrationJiraPlugin = IntegrationJiraPlugin;
IntegrationJiraPlugin.options = {};
exports.IntegrationJiraPlugin = IntegrationJiraPlugin = IntegrationJiraPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [
            jira_module_1.JiraModule.forRoot({
                isGlobal: true,
                path: 'integration/jira',
                config: {
                    appName: jira.appName,
                    appDescription: jira.appDescription,
                    appKey: jira.appKey,
                    baseUrl: jira.baseUrl,
                    vendorName: jira.vendorName,
                    vendorUrl: jira.vendorUrl
                }
            })
        ]
    })
], IntegrationJiraPlugin);
//# sourceMappingURL=integration-jira.plugin.js.map