"use strict";
var PluginBillingProcessPaymentHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginBillingProcessPaymentHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const plugin_billing_process_payment_command_1 = require("../plugin-billing-process-payment.command");
/**
 * Handler for processing payments for plugin billing records
 * Implements CQRS pattern with event-driven architecture
 *
 * TODO: This handler needs payment gateway integration
 * Current implementation uses mock payment processing
 */
let PluginBillingProcessPaymentHandler = PluginBillingProcessPaymentHandler_1 = class PluginBillingProcessPaymentHandler {
    constructor(pluginBillingService, eventBus) {
        this.pluginBillingService = pluginBillingService;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(PluginBillingProcessPaymentHandler_1.name);
    }
    /**
     * Executes the payment processing command
     * @param command - The payment processing command
     * @returns The updated billing record
     */
    async execute(command) {
        const { billingId, paymentInput } = command;
        try {
            this.logger.log(`Processing payment for billing: ${billingId}`);
            // Retrieve the billing record
            const billing = await this.pluginBillingService.findOneByIdString(billingId);
            if (!billing) {
                throw new common_1.NotFoundException(`Billing record with ID ${billingId} not found`);
            }
            // Validate billing status
            if (billing.status === contracts_1.PluginBillingStatus.PAID) {
                throw new common_1.BadRequestException('Billing record is already paid');
            }
            if (billing.status === contracts_1.PluginBillingStatus.CANCELLED) {
                throw new common_1.BadRequestException('Cannot process payment for cancelled billing');
            }
            // Process payment through payment gateway (mock implementation)
            const paymentResult = await this.processPaymentGateway(billing, paymentInput);
            if (paymentResult.success) {
                // Mark billing as paid
                const updatedBilling = await this.pluginBillingService.markAsPaid(billingId, paymentInput.paymentReference);
                this.logger.log(`Payment processed successfully for billing: ${billingId}`);
                // Publish success event
                await this.eventBus.publish(new domain_1.PluginBillingPaidEvent(updatedBilling, paymentInput.paymentReference));
                return updatedBilling;
            }
            else {
                // Mark billing as failed
                const failureReason = paymentResult.error || 'Payment processing failed';
                await this.pluginBillingService.markAsFailed(billingId, failureReason);
                this.logger.error(`Payment failed for billing: ${billingId} - ${failureReason}`);
                // Publish failure event
                await this.eventBus.publish(new domain_1.PluginBillingFailedEvent(billing, failureReason));
                throw new common_1.BadRequestException(`Payment processing failed: ${failureReason}`);
            }
        }
        catch (error) {
            this.logger.error(`Error processing payment for billing ${billingId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    /**
     * Process payment through payment gateway
     * TODO: Integrate with actual payment gateway (Stripe, PayPal, etc.)
     * This is a placeholder for actual payment gateway integration
     * @param billing - The billing record
     * @param paymentInput - Payment input data
     * @returns Payment result
     */
    async processPaymentGateway(billing, paymentInput) {
        // TODO: Replace mock implementation with actual payment gateway integration
        // Supported gateways: Stripe, PayPal, Square, etc.
        // For now, return a mock success response
        this.logger.log(`[MOCK] Payment processing for amount: ${billing.amount} ${billing.currency}`);
        this.logger.warn('Payment gateway integration not implemented - using mock response');
        try {
            // Simulate payment gateway call
            const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            // TODO: Implement actual payment gateway logic here
            /*
            const paymentGateway = new PaymentGateway();
            const result = await paymentGateway.processPayment({
                amount: billing.amount,
                currency: billing.currency,
                paymentMethod: paymentInput.paymentMethod,
                metadata: paymentInput.metadata
            });
            return {
                success: result.success,
                transactionId: result.transactionId,
                error: result.error
            };
            */
            return {
                success: true,
                transactionId
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
exports.PluginBillingProcessPaymentHandler = PluginBillingProcessPaymentHandler;
exports.PluginBillingProcessPaymentHandler = PluginBillingProcessPaymentHandler = PluginBillingProcessPaymentHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(plugin_billing_process_payment_command_1.PluginBillingProcessPaymentCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginBillingService, cqrs_1.EventBus])
], PluginBillingProcessPaymentHandler);
//# sourceMappingURL=plugin-billing-process-payment.handler.js.map