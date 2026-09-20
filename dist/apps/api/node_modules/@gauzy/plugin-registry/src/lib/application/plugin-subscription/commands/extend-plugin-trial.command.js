"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendPluginTrialCommand = void 0;
class ExtendPluginTrialCommand {
    constructor(subscriptionId, extensionDays, reason, tenantId, organizationId, userId) {
        this.subscriptionId = subscriptionId;
        this.extensionDays = extensionDays;
        this.reason = reason;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.ExtendPluginTrialCommand = ExtendPluginTrialCommand;
ExtendPluginTrialCommand.type = '[Plugin Subscription] Extend Trial';
//# sourceMappingURL=extend-plugin-trial.command.js.map