"use strict";
var PluginBillingFailedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingFailedHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_subscription_service_1 = require("../../services/plugin-subscription.service");
const plugin_billing_failed_event_1 = require("../plugin-billing-failed.event");
/**
 * Event handler for PluginBillingFailedEvent
 * Handles failed payment scenarios and notifies relevant parties
 */
let PluginBillingFailedHandler = PluginBillingFailedHandler_1 = class PluginBillingFailedHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.logger = new common_1.Logger(PluginBillingFailedHandler_1.name);
    }
    /**
     * Handles the billing failed event
     * @param event - The billing failed event
     */
    async handle(event) {
        const { billing, reason } = event;
        try {
            this.logger.log(`Handling billing failed event for billing: ${billing.id}`);
            // Get the subscription
            const subscription = await this.pluginSubscriptionService.findOneByIdString(billing.subscriptionId);
            if (!subscription) {
                this.logger.warn(`Subscription not found for billing: ${billing.id}`);
                return;
            }
            // Update subscription metadata with failure information
            const failureCount = (subscription.metadata?.paymentFailureCount || 0) + 1;
            const metadata = {
                ...subscription.metadata,
                lastPaymentFailure: new Date().toISOString(),
                lastPaymentFailureReason: reason,
                paymentFailureCount: failureCount
            };
            // Suspend subscription after 3 failed attempts
            if (failureCount >= 3) {
                await this.pluginSubscriptionService.update(billing.subscriptionId, {
                    status: contracts_1.PluginSubscriptionStatus.SUSPENDED,
                    metadata: {
                        ...metadata,
                        suspendedAt: new Date().toISOString(),
                        suspensionReason: 'multiple_payment_failures'
                    }
                });
                this.logger.warn(`Suspended subscription ${billing.subscriptionId} after ${failureCount} failed payments`);
                // TODO: Send suspension notification email
            }
            else {
                await this.pluginSubscriptionService.update(billing.subscriptionId, {
                    metadata: metadata
                });
                this.logger.log(`Updated subscription ${billing.subscriptionId} with failure count: ${failureCount}`);
                // TODO: Send payment failure notification email
            }
            // TODO: Trigger retry logic for payment
            // TODO: Log to monitoring/analytics system
            this.logger.log(`Successfully handled billing failed event for billing: ${billing.id}`);
        }
        catch (error) {
            this.logger.error(`Error handling billing failed event for billing ${billing.id}: ${error.message}`, error.stack);
        }
    }
};
exports.PluginBillingFailedHandler = PluginBillingFailedHandler;
exports.PluginBillingFailedHandler = PluginBillingFailedHandler = PluginBillingFailedHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(plugin_billing_failed_event_1.PluginBillingFailedEvent),
    tslib_1.__metadata("design:paramtypes", [plugin_subscription_service_1.PluginSubscriptionService])
], PluginBillingFailedHandler);
//# sourceMappingURL=plugin-billing-failed.handler.js.map