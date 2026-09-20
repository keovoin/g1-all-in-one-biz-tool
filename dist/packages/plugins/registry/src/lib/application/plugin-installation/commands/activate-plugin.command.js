"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivatePluginCommand = void 0;
class ActivatePluginCommand {
    constructor(pluginId, installationId) {
        this.pluginId = pluginId;
        this.installationId = installationId;
    }
}
exports.ActivatePluginCommand = ActivatePluginCommand;
ActivatePluginCommand.type = '[Plugin] Activate';
//# sourceMappingURL=activate-plugin.command.js.map