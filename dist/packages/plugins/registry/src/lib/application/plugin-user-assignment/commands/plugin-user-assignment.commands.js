"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkAssignUsersToPluginsCommand = exports.UnassignUsersFromPluginCommand = exports.AssignUsersToPluginCommand = void 0;
/**
 * Command to assign users to a plugin
 */
class AssignUsersToPluginCommand {
    constructor(pluginId, userIds, tenantId, organizationId, reason) {
        this.pluginId = pluginId;
        this.userIds = userIds;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.reason = reason;
    }
}
exports.AssignUsersToPluginCommand = AssignUsersToPluginCommand;
AssignUsersToPluginCommand.type = '[Plugin User Assignment] Assign Users To Plugin';
/**
 * Command to unassign users from a plugin
 */
class UnassignUsersFromPluginCommand {
    constructor(pluginId, userIds, tenantId, organizationId, reason) {
        this.pluginId = pluginId;
        this.userIds = userIds;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.reason = reason;
    }
}
exports.UnassignUsersFromPluginCommand = UnassignUsersFromPluginCommand;
UnassignUsersFromPluginCommand.type = '[Plugin User Assignment] Unassign Users From Plugin';
/**
 * Command to bulk assign users to multiple plugins
 */
class BulkAssignUsersToPluginsCommand {
    constructor(pluginIds, userIds, tenantId, organizationId, reason) {
        this.pluginIds = pluginIds;
        this.userIds = userIds;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.reason = reason;
    }
}
exports.BulkAssignUsersToPluginsCommand = BulkAssignUsersToPluginsCommand;
BulkAssignUsersToPluginsCommand.type = '[Plugin User Assignment] Bulk Assign Users To Plugins';
//# sourceMappingURL=plugin-user-assignment.commands.js.map