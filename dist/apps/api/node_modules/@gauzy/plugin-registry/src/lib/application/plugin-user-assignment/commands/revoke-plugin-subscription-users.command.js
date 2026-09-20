"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokePluginSubscriptionUsersCommand = void 0;
class RevokePluginSubscriptionUsersCommand {
    constructor(pluginId, revokeDto, tenantId, organizationId, requestingUserId) {
        this.pluginId = pluginId;
        this.revokeDto = revokeDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.requestingUserId = requestingUserId;
    }
}
exports.RevokePluginSubscriptionUsersCommand = RevokePluginSubscriptionUsersCommand;
RevokePluginSubscriptionUsersCommand.type = '[Plugin Subscription Access] Revoke Users';
//# sourceMappingURL=revoke-plugin-subscription-users.command.js.map