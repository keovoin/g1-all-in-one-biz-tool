"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UninstallPluginCommand = void 0;
class UninstallPluginCommand {
    constructor(pluginId, installationId) {
        this.pluginId = pluginId;
        this.installationId = installationId;
    }
}
exports.UninstallPluginCommand = UninstallPluginCommand;
UninstallPluginCommand.type = '[Plugin] Uninstall';
//# sourceMappingURL=uninstall-plugin.command.js.map