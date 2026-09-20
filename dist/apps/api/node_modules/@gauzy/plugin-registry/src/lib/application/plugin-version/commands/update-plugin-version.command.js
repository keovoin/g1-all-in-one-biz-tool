"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginVersionCommand = void 0;
class UpdatePluginVersionCommand {
    constructor(pluginId, versionId, input) {
        this.pluginId = pluginId;
        this.versionId = versionId;
        this.input = input;
    }
}
exports.UpdatePluginVersionCommand = UpdatePluginVersionCommand;
UpdatePluginVersionCommand.type = '[Plugin Version] Update';
//# sourceMappingURL=update-plugin-version.command.js.map