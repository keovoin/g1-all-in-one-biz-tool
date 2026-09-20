"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelPluginSubscriptionCommand = void 0;
class CancelPluginSubscriptionCommand {
    constructor(id, reason) {
        this.id = id;
        this.reason = reason;
    }
}
exports.CancelPluginSubscriptionCommand = CancelPluginSubscriptionCommand;
CancelPluginSubscriptionCommand.type = '[Plugin Subscription] Cancel';
//# sourceMappingURL=cancel-plugin-subscription.command.js.map