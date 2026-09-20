"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginConfigSetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_config_set_command_1 = require("../plugin-config-set.command");
let PluginConfigSetHandler = class PluginConfigSetHandler {
    async execute(command) {
        const { input } = command;
        // TODO: Implement plugin config set logic
        return input;
    }
};
exports.PluginConfigSetHandler = PluginConfigSetHandler;
exports.PluginConfigSetHandler = PluginConfigSetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(plugin_config_set_command_1.PluginConfigSetCommand)
], PluginConfigSetHandler);
//# sourceMappingURL=plugin-config-set.handler.js.map