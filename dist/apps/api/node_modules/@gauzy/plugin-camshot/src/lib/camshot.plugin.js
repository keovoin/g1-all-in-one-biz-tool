"use strict";
var CamshotPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamshotPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const camshot_module_1 = require("./camshot.module");
const camshot_entity_1 = require("./entity/camshot.entity");
let CamshotPlugin = CamshotPlugin_1 = class CamshotPlugin {
    constructor() {
        // We enable by default additional logging for each event
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${CamshotPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${CamshotPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.CamshotPlugin = CamshotPlugin;
exports.CamshotPlugin = CamshotPlugin = CamshotPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [camshot_module_1.CamshotModule],
        entities: [camshot_entity_1.Camshot],
    })
], CamshotPlugin);
//# sourceMappingURL=camshot.plugin.js.map