"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationPlanePlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plane_module_1 = require("./plane.module");
let IntegrationPlanePlugin = class IntegrationPlanePlugin {
    constructor() {
        this.logEnabled = true;
    }
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log('IntegrationPlanePlugin is being bootstrapped...');
        }
    }
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log('IntegrationPlanePlugin is being destroyed...');
        }
    }
};
exports.IntegrationPlanePlugin = IntegrationPlanePlugin;
exports.IntegrationPlanePlugin = IntegrationPlanePlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [plane_module_1.PlaneModule],
        entities: [],
        configuration: (config) => {
            return config;
        }
    })
], IntegrationPlanePlugin);
//# sourceMappingURL=integration-plane.plugin.js.map