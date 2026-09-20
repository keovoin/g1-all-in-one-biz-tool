"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginConfigGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_config_get_command_1 = require("../plugin-config-get.command");
let PluginConfigGetHandler = class PluginConfigGetHandler {
    async execute(command) {
        const { input } = command;
        // TODO: Implement plugin config get logic
        return input;
    }
};
exports.PluginConfigGetHandler = PluginConfigGetHandler;
exports.PluginConfigGetHandler = PluginConfigGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(plugin_config_get_command_1.PluginConfigGetCommand)
], PluginConfigGetHandler);
//# sourceMappingURL=plugin-config-get.handler.js.map