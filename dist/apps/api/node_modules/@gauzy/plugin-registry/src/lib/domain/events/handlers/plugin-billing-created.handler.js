"use strict";
var PluginBillingCreatedHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingCreatedHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_subscription_service_1 = require("../../services/plugin-subscription.service");
const plugin_billing_created_event_1 = require("../plugin-billing-created.event");
/**
 * Event handler for PluginBillingCreatedEvent
 * Handles post-creation actions when a billing record is created
 */
let PluginBillingCreatedHandler = PluginBillingCreatedHandler_1 = class PluginBillingCreatedHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.logger = new common_1.Logger(PluginBillingCreatedHandler_1.name);
    }
    /**
     * Handles the billing created event
     * @param event - The billing created event
     */
    async handle(event) {
        const { billing } = event;
        try {
            this.logger.log(`Handling billing created event for billing: ${billing.id}`);
            // Update subscription metadata with latest billing information
            const subscription = await this.pluginSubscriptionService.findOneByIdString(billing.subscriptionId);
            if (subscription) {
                await this.pluginSubscriptionService.update(billing.subscriptionId, {
                    metadata: {
                        ...subscription.metadata,
                        lastBillingId: billing.id,
                        lastBillingDate: billing.billingDate,
                        lastBillingAmount: billing.amount
                    }
                });
            }
            this.logger.log(`Successfully handled billing created event for billing: ${billing.id}`);
        }
        catch (error) {
            this.logger.error(`Error handling billing created event for billing ${billing.id}: ${error.message}`, error.stack);
            // Don't throw error to prevent breaking the event flow
        }
    }
};
exports.PluginBillingCreatedHandler = PluginBillingCreatedHandler;
exports.PluginBillingCreatedHandler = PluginBillingCreatedHandler = PluginBillingCreatedHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(plugin_billing_created_event_1.PluginBillingCreatedEvent),
    tslib_1.__metadata("design:paramtypes", [plugin_subscription_service_1.PluginSubscriptionService])
], PluginBillingCreatedHandler);
//# sourceMappingURL=plugin-billing-created.handler.js.map