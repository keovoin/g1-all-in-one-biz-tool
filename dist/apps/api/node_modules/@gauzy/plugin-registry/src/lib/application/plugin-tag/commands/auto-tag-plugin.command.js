"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoTagPluginCommand = void 0;
/**
 * Command to automatically create tags for a plugin based on its properties
 */
class AutoTagPluginCommand {
    constructor(pluginId, pluginData, options) {
        this.pluginId = pluginId;
        this.pluginData = pluginData;
        this.options = options;
    }
}
exports.AutoTagPluginCommand = AutoTagPluginCommand;
AutoTagPluginCommand.type = '[PluginTag] Auto Tag Plugin';
//# sourceMappingURL=auto-tag-plugin.command.js.map