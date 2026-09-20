"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationActivepiecesPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const activepieces_module_1 = require("./activepieces.module");
let IntegrationActivepiecesPlugin = class IntegrationActivepiecesPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log('IntegrationActivepiecesPlugin is being bootstrapped...');
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log('IntegrationActivepiecesPlugin is being destroyed...');
        }
    }
};
exports.IntegrationActivepiecesPlugin = IntegrationActivepiecesPlugin;
exports.IntegrationActivepiecesPlugin = IntegrationActivepiecesPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        /**
         * An array of modules that will be imported and registered with the plugin.
         */
        imports: [activepieces_module_1.ActivepiecesModule],
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
], IntegrationActivepiecesPlugin);
//# sourceMappingURL=integration-activepieces.plugin.js.map