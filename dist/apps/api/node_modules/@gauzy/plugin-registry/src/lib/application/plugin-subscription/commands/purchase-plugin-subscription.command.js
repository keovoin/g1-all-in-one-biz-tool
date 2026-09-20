"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasePluginSubscriptionCommand = void 0;
class PurchasePluginSubscriptionCommand {
    constructor(purchaseDto, tenantId, organizationId, userId) {
        this.purchaseDto = purchaseDto;
        this.tenantId = tenantId;
        this.organizationId = organizationId;
        this.userId = userId;
    }
}
exports.PurchasePluginSubscriptionCommand = PurchasePluginSubscriptionCommand;
PurchasePluginSubscriptionCommand.type = '[Plugin Subscription] Purchase';
//# sourceMappingURL=purchase-plugin-subscription.command.js.map