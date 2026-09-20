import { EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PluginBilling, PluginBillingService } from '../../../../domain';
import { PluginBillingProcessPaymentCommand } from '../plugin-billing-process-payment.command';
/**
 * Handler for processing payments for plugin billing records
 * Implements CQRS pattern with event-driven architecture
 *
 * TODO: This handler needs payment gateway integration
 * Current implementation uses mock payment processing
 */
export declare class PluginBillingProcessPaymentHandler implements ICommandHandler<PluginBillingProcessPaymentCommand> {
    private readonly pluginBillingService;
    private readonly eventBus;
    private readonly logger;
    constructor(pluginBillingService: PluginBillingService, eventBus: EventBus);
    /**
     * Executes the payment processing command
     * @param command - The payment processing command
     * @returns The updated billing record
     */
    execute(command: PluginBillingProcessPaymentCommand): Promise<PluginBilling>;
    /**
     * Process payment through payment gateway
     * TODO: Integrate with actual payment gateway (Stripe, PayPal, etc.)
     * This is a placeholder for actual payment gateway integration
     * @param billing - The billing record
     * @param paymentInput - Payment input data
     * @returns Payment result
     */
    private processPaymentGateway;
}
