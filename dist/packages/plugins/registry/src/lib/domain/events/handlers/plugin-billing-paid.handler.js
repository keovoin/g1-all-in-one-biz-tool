"use strict";
var PluginBillingPaidHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingPaidHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_subscription_service_1 = require("../../services/plugin-subscription.service");
const plugin_billing_paid_event_1 = require("../plugin-billing-paid.event");
/**
 * Event handler for PluginBillingPaidEvent
 * Updates subscription status and handles post-payment actions
 */
let PluginBillingPaidHandler = PluginBillingPaidHandler_1 = class PluginBillingPaidHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.logger = new common_1.Logger(PluginBillingPaidHandler_1.name);
    }
    /**
     * Handles the billing paid event
     * @param event - The billing paid event
     */
    async handle(event) {
        const { billing, paymentReference } = event;
        try {
            this.logger.log(`Handling billing paid event for billing: ${billing.id}`);
            // Get the subscription
            const subscription = await this.pluginSubscriptionService.findOneByIdString(billing.subscriptionId);
            if (!subscription) {
                this.logger.warn(`Subscription not found for billing: ${billing.id}`);
                return;
            }
            // If subscription was suspended due to payment failure, reactivate it
            if (subscription.status === contracts_1.PluginSubscriptionStatus.SUSPENDED) {
                await this.pluginSubscriptionService.update(billing.subscriptionId, {
                    status: contracts_1.PluginSubscriptionStatus.ACTIVE,
                    metadata: {
                        ...subscription.metadata,
                        reactivatedAt: new Date().toISOString(),
                        reactivatedBy: 'payment_success',
                        paymentReference
                    }
                });
                this.logger.log(`Reactivated suspended subscription: ${billing.subscriptionId}`);
            }
            // Update subscription metadata with payment information
            await this.pluginSubscriptionService.update(billing.subscriptionId, {
                metadata: {
                    ...subscription.metadata,
                    lastPaymentDate: new Date().toISOString(),
                    lastPaymentAmount: billing.amount,
                    lastPaymentReference: paymentReference
                }
            });
            // TODO: Send payment confirmation email
            // TODO: Generate invoice/receipt
            // TODO: Update analytics/reporting
            this.logger.log(`Successfully handled billing paid event for billing: ${billing.id}`);
        }
        catch (error) {
            this.logger.error(`Error handling billing paid event for billing ${billing.id}: ${error.message}`, error.stack);
        }
    }
};
exports.PluginBillingPaidHandler = PluginBillingPaidHandler;
exports.PluginBillingPaidHandler = PluginBillingPaidHandler = PluginBillingPaidHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(plugin_billing_paid_event_1.PluginBillingPaidEvent),
    tslib_1.__metadata("design:paramtypes", [plugin_subscription_service_1.PluginSubscriptionService])
], PluginBillingPaidHandler);
//# sourceMappingURL=plugin-billing-paid.handler.js.map