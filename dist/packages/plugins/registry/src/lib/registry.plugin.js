"use strict";
var RegistryPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const chalk = require("chalk");
const entities_1 = require("./domain/entities");
const plugin_registry_module_1 = require("./plugin-registry.module");
let RegistryPlugin = RegistryPlugin_1 = class RegistryPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${RegistryPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${RegistryPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.RegistryPlugin = RegistryPlugin;
exports.RegistryPlugin = RegistryPlugin = RegistryPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [plugin_registry_module_1.PluginRegistryModule],
        entities: entities_1.entities
    })
], RegistryPlugin);
//# sourceMappingURL=registry.plugin.js.map