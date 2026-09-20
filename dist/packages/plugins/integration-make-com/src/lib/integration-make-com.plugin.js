"use strict";
var IntegrationMakeComPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMakeComPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const make_com_module_1 = require("./make-com.module");
let IntegrationMakeComPlugin = IntegrationMakeComPlugin_1 = class IntegrationMakeComPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationMakeComPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationMakeComPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.IntegrationMakeComPlugin = IntegrationMakeComPlugin;
exports.IntegrationMakeComPlugin = IntegrationMakeComPlugin = IntegrationMakeComPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        /**
         * An array of modules that will be imported and registered with the plugin.
         */
        imports: [make_com_module_1.MakeComModule],
        /**
         * No entities needed for Make.com integration since we're using existing
         * IntegrationSetting entity
         */
        entities: [],
        /**
         * A callback that receives the main plugin configuration object and allows
         * custom modifications before returning the final configuration.
         *
         * @param {ApplicationPluginConfig} config - The initial plugin configuration object.
         * @returns {ApplicationPluginConfig} - The modified plugin configuration object.
         */
        configuration: (config) => {
            return config;
        }
    })
], IntegrationMakeComPlugin);
//# sourceMappingURL=integration-make-com.plugin.js.map