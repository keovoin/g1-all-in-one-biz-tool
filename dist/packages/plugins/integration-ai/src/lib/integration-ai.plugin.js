"use strict";
var IntegrationAIPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationAIPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const integration_ai_module_1 = require("./integration-ai.module");
let IntegrationAIPlugin = IntegrationAIPlugin_1 = class IntegrationAIPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${IntegrationAIPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${IntegrationAIPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.IntegrationAIPlugin = IntegrationAIPlugin;
exports.IntegrationAIPlugin = IntegrationAIPlugin = IntegrationAIPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [integration_ai_module_1.IntegrationAIModule]
    }),
    tslib_1.__metadata("design:paramtypes", [])
], IntegrationAIPlugin);
//# sourceMappingURL=integration-ai.plugin.js.map