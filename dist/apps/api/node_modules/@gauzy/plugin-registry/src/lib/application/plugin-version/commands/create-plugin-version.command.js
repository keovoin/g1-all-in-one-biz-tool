"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginVersionCommand = void 0;
/**
 * Command to create a new plugin version.
 */
class CreatePluginVersionCommand {
    /**
     * Creates an instance of CreatePluginVersionCommand.
     *
     * @param {ID} pluginId - The unique identifier of the plugin.
     * @param {PluginVersionDTO} dto - The data transfer object containing the plugin version details.
     */
    constructor(pluginId, dto) {
        this.pluginId = pluginId;
        this.dto = dto;
    }
}
exports.CreatePluginVersionCommand = CreatePluginVersionCommand;
/** Command type identifier */
CreatePluginVersionCommand.type = '[Plugin Version] Create';
//# sourceMappingURL=create-plugin-version.command.js.map