"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSourceCommand = void 0;
class CreatePluginSourceCommand {
    constructor(pluginId, versionId, input) {
        this.pluginId = pluginId;
        this.versionId = versionId;
        this.input = input;
    }
}
exports.CreatePluginSourceCommand = CreatePluginSourceCommand;
CreatePluginSourceCommand.type = '[Plugin Source] Create';
//# sourceMappingURL=create-plugin-source.command.js.map