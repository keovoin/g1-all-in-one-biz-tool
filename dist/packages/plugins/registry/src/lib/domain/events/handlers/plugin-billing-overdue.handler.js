"use strict";
var PluginBillingOverdueHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingOverdueHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_billing_overdue_event_1 = require("../plugin-billing-overdue.event");
/**
 * Event handler for PluginBillingOverdueEvent
 * Handles overdue billing scenarios and sends reminders
 */
let PluginBillingOverdueHandler = PluginBillingOverdueHandler_1 = class PluginBillingOverdueHandler {
    constructor() {
        this.logger = new common_1.Logger(PluginBillingOverdueHandler_1.name);
    }
    /**
     * Handles the billing overdue event
     * @param event - The billing overdue event
     */
    async handle(event) {
        const { billing } = event;
        try {
            this.logger.log(`Handling billing overdue event for billing: ${billing.id}`);
            // TODO: Send overdue payment reminder email
            // TODO: Apply late fees if configured
            // TODO: Update subscription status if needed
            // TODO: Log to analytics system
            this.logger.log(`Successfully handled billing overdue event for billing: ${billing.id}`);
        }
        catch (error) {
            this.logger.error(`Error handling billing overdue event for billing ${billing.id}: ${error.message}`, error.stack);
        }
    }
};
exports.PluginBillingOverdueHandler = PluginBillingOverdueHandler;
exports.PluginBillingOverdueHandler = PluginBillingOverdueHandler = PluginBillingOverdueHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(plugin_billing_overdue_event_1.PluginBillingOverdueEvent)
], PluginBillingOverdueHandler);
//# sourceMappingURL=plugin-billing-overdue.handler.js.map