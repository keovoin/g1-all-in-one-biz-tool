"use strict";
var VideosPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const videos_module_1 = require("./videos.module");
const video_entity_1 = require("./entities/video.entity");
let VideosPlugin = VideosPlugin_1 = class VideosPlugin {
    constructor() {
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${VideosPlugin_1.name} is being bootstrapped...`));
        }
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${VideosPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.VideosPlugin = VideosPlugin;
exports.VideosPlugin = VideosPlugin = VideosPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [videos_module_1.VideosModule],
        entities: [video_entity_1.Video],
        providers: [],
        exports: []
    })
], VideosPlugin);
//# sourceMappingURL=videos.plugin.js.map