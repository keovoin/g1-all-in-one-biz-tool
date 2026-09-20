"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEverAsyncPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const ever_async_module_1 = require("./ever-async.module");
let IntegrationEverAsyncPlugin = class IntegrationEverAsyncPlugin {
    constructor() {
        this.logEnabled = true;
    }
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log('IntegrationEverAsyncPlugin is being bootstrapped...');
        }
    }
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log('IntegrationEverAsyncPlugin is being destroyed...');
        }
    }
};
exports.IntegrationEverAsyncPlugin = IntegrationEverAsyncPlugin;
exports.IntegrationEverAsyncPlugin = IntegrationEverAsyncPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [ever_async_module_1.EverAsyncModule],
        entities: [],
        configuration: (config) => {
            return config;
        }
    })
], IntegrationEverAsyncPlugin);
//# sourceMappingURL=integration-ever-async.plugin.js.map