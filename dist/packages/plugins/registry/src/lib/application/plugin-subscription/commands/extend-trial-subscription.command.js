"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendTrialSubscriptionCommand = void 0;
class ExtendTrialSubscriptionCommand {
    constructor(subscriptionId, days, tenantId, organizationId, userId) {
        this.subscriptionId = subscriptionId;
        this.days = days;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.ExtendTrialSubscriptionCommand = ExtendTrialSubscriptionCommand;
ExtendTrialSubscriptionCommand.type = '[Plugin Subscription] Extend Trial';
//# sourceMappingURL=extend-trial-subscription.command.js.map