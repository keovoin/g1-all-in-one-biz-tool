"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingPaidEvent = void 0;
/**
 * Domain event for when a billing payment is successful
 */
class PluginBillingPaidEvent {
    constructor(billing, paymentReference) {
        this.billing = billing;
        this.paymentReference = paymentReference;
    }
}
exports.PluginBillingPaidEvent = PluginBillingPaidEvent;
//# sourceMappingURL=plugin-billing-paid.event.js.map