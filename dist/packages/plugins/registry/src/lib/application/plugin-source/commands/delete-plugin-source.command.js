"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePluginSourceCommand = void 0;
class DeletePluginSourceCommand {
    constructor(sourceId, versionId, pluginId) {
        this.sourceId = sourceId;
        this.versionId = versionId;
        this.pluginId = pluginId;
    }
}
exports.DeletePluginSourceCommand = DeletePluginSourceCommand;
DeletePluginSourceCommand.type = '[Plugin] Delete Source';
//# sourceMappingURL=delete-plugin-source.command.js.map