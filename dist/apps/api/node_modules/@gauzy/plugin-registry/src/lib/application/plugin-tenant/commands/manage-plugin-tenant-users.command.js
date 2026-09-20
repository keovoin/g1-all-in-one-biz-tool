"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagePluginTenantUsersCommand = void 0;
/**
 * Command to manage allowed/denied/unassigned users for a plugin tenant.
 * Supports operations: allow, deny, remove-allowed, remove-denied, unassign.
 */
class ManagePluginTenantUsersCommand {
    constructor(pluginTenantId, userIds, operation, reason) {
        this.pluginTenantId = pluginTenantId;
        this.userIds = userIds;
        this.operation = operation;
        this.reason = reason;
    }
}
exports.ManagePluginTenantUsersCommand = ManagePluginTenantUsersCommand;
ManagePluginTenantUsersCommand.type = '[Plugin Tenant] Manage Users';
//# sourceMappingURL=manage-plugin-tenant-users.command.js.map