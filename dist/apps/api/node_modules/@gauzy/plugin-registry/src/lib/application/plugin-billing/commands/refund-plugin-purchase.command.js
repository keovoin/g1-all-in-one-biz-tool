"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPluginPurchaseCommand = void 0;
class RefundPluginPurchaseCommand {
    constructor(subscriptionId, refundReason, refundAmount, tenantId, organizationId, userId) {
        this.subscriptionId = subscriptionId;
        this.refundReason = refundReason;
        this.refundAmount = refundAmount;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.RefundPluginPurchaseCommand = RefundPluginPurchaseCommand;
RefundPluginPurchaseCommand.type = '[Plugin Purchase] Refund';
//# sourceMappingURL=refund-plugin-purchase.command.js.map