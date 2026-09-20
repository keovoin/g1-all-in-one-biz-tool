"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignPluginSubscriptionUsersCommand = void 0;
class AssignPluginSubscriptionUsersCommand {
    constructor(pluginId, assignDto, tenantId, organizationId, requestingUserId) {
        this.pluginId = pluginId;
        this.assignDto = assignDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.requestingUserId = requestingUserId;
    }
}
exports.AssignPluginSubscriptionUsersCommand = AssignPluginSubscriptionUsersCommand;
AssignPluginSubscriptionUsersCommand.type = '[Plugin Subscription Access] Assign Users';
//# sourceMappingURL=assign-plugin-subscription-users.command.js.map