"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplacePluginTagsCommand = exports.BulkDeletePluginTagsCommand = exports.DeletePluginTagCommand = void 0;
/**
 * Command to delete a single plugin-tag relationship
 */
class DeletePluginTagCommand {
    constructor(id) {
        this.id = id;
    }
}
exports.DeletePluginTagCommand = DeletePluginTagCommand;
DeletePluginTagCommand.type = '[PluginTag] Delete';
/**
 * Command to bulk delete plugin-tag relationships
 */
class BulkDeletePluginTagsCommand {
    constructor(input) {
        this.input = input;
    }
}
exports.BulkDeletePluginTagsCommand = BulkDeletePluginTagsCommand;
BulkDeletePluginTagsCommand.type = '[PluginTag] Bulk Delete';
/**
 * Command to replace all tags for a plugin
 */
class ReplacePluginTagsCommand {
    constructor(pluginId, tagIds, tenantId, organizationId) {
        this.pluginId = pluginId;
        this.tagIds = tagIds;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
    }
}
exports.ReplacePluginTagsCommand = ReplacePluginTagsCommand;
ReplacePluginTagsCommand.type = '[PluginTag] Replace Plugin Tags';
//# sourceMappingURL=delete-plugin-tag.command.js.map