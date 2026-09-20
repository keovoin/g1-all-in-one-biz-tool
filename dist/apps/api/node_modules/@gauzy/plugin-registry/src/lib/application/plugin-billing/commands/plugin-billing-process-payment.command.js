"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingProcessPaymentCommand = void 0;
/**
 * Command for processing payment for a plugin billing record
 */
class PluginBillingProcessPaymentCommand {
    constructor(billingId, paymentInput) {
        this.billingId = billingId;
        this.paymentInput = paymentInput;
    }
}
exports.PluginBillingProcessPaymentCommand = PluginBillingProcessPaymentCommand;
PluginBillingProcessPaymentCommand.type = '[PluginBilling] Process Payment';
//# sourceMappingURL=plugin-billing-process-payment.command.js.map