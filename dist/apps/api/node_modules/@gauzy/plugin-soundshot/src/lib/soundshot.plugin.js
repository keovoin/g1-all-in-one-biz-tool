"use strict";
var SoundshotPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundshotPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const soundshot_module_1 = require("./soundshot.module");
const soundshot_entity_1 = require("./entity/soundshot.entity");
let SoundshotPlugin = SoundshotPlugin_1 = class SoundshotPlugin {
    constructor() {
        // We enable by default additional logging for each event
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${SoundshotPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${SoundshotPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.SoundshotPlugin = SoundshotPlugin;
exports.SoundshotPlugin = SoundshotPlugin = SoundshotPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [soundshot_module_1.SoundshotModule],
        entities: [soundshot_entity_1.Soundshot],
    })
], SoundshotPlugin);
//# sourceMappingURL=soundshot.plugin.js.map