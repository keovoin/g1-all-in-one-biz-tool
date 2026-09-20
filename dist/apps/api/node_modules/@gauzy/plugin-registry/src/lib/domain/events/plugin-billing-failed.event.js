"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingFailedEvent = void 0;
/**
 * Domain event for when a billing payment fails
 */
class PluginBillingFailedEvent {
    constructor(billing, reason) {
        this.billing = billing;
        this.reason = reason;
    }
}
exports.PluginBillingFailedEvent = PluginBillingFailedEvent;
//# sourceMappingURL=plugin-billing-failed.event.js.map