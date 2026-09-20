"use strict";
var IntegrationHubstaffPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationHubstaffPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const hubstaff_module_1 = require("./hubstaff.module");
let IntegrationHubstaffPlugin = IntegrationHubstaffPlugin_1 = class IntegrationHubstaffPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationHubstaffPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${IntegrationHubstaffPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.IntegrationHubstaffPlugin = IntegrationHubstaffPlugin;
exports.IntegrationHubstaffPlugin = IntegrationHubstaffPlugin = IntegrationHubstaffPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        /**
         * An array of modules that will be imported and registered with the plugin.
         */
        imports: [hubstaff_module_1.HubstaffModule],
        /**
         * An array of Entity classes. The plugin (or ORM) will
         * register these entities for use within the application.
         */
        entities: [],
        /**
         * A callback that receives the main plugin configuration object and allows
         * custom modifications before returning the final configuration.
         *
         * @param {ApplicationPluginConfig} config - The initial plugin configuration object.
         * @returns {ApplicationPluginConfig} - The modified plugin configuration object.
         *
         * In this example, we're adding a custom relation field (`proposals`) to the `Tag` entity.
         */
        configuration: (config) => {
            return config;
        }
    })
], IntegrationHubstaffPlugin);
//# sourceMappingURL=integration-hubstaff.plugin.js.map