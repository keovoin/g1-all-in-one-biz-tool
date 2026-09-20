"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginTagsPriorityCommand = exports.BulkUpdatePluginTagsCommand = exports.UpdatePluginTagCommand = void 0;
/**
 * Command to update a single plugin-tag relationship
 */
class UpdatePluginTagCommand {
    constructor(id, input) {
        this.id = id;
        this.input = input;
    }
}
exports.UpdatePluginTagCommand = UpdatePluginTagCommand;
UpdatePluginTagCommand.type = '[PluginTag] Update';
/**
 * Command to bulk update plugin-tag relationships
 */
class BulkUpdatePluginTagsCommand {
    constructor(updates) {
        this.updates = updates;
    }
}
exports.BulkUpdatePluginTagsCommand = BulkUpdatePluginTagsCommand;
BulkUpdatePluginTagsCommand.type = '[PluginTag] Bulk Update';
/**
 * Command to update priority order of plugin tags
 */
class UpdatePluginTagsPriorityCommand {
    constructor(priorities) {
        this.priorities = priorities;
    }
}
exports.UpdatePluginTagsPriorityCommand = UpdatePluginTagsPriorityCommand;
UpdatePluginTagsPriorityCommand.type = '[PluginTag] Update Priority';
//# sourceMappingURL=update-plugin-tag.command.js.map