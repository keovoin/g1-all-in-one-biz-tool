"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSimPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const sim_module_1 = require("./sim.module");
const sim_workflow_execution_entity_1 = require("./sim-workflow-execution.entity");
let IntegrationSimPlugin = class IntegrationSimPlugin {
    constructor() {
        // Enable additional logging for plugin lifecycle events
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log('IntegrationSimPlugin is being bootstrapped...');
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log('IntegrationSimPlugin is being destroyed...');
        }
    }
};
exports.IntegrationSimPlugin = IntegrationSimPlugin;
exports.IntegrationSimPlugin = IntegrationSimPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        /**
         * An array of modules that will be imported and registered with the plugin.
         */
        imports: [sim_module_1.SimModule],
        /**
         * An array of entity classes registered by this plugin.
         */
        entities: [sim_workflow_execution_entity_1.SimWorkflowExecution],
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
], IntegrationSimPlugin);
//# sourceMappingURL=integration-sim.plugin.js.map