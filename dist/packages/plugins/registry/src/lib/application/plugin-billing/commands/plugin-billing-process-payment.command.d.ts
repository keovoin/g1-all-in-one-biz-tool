import { ICommand } from '@nestjs/cqrs';
/**
 * Command for processing payment for a plugin billing record
 */
export declare class PluginBillingProcessPaymentCommand implements ICommand {
    readonly billingId: string;
    readonly paymentInput: {
        paymentMethod: string;
        paymentReference?: string;
        metadata?: Record<string, any>;
    };
    static readonly type = "[PluginBilling] Process Payment";
    constructor(billingId: string, paymentInput: {
        paymentMethod: string;
        paymentReference?: string;
        metadata?: Record<string, any>;
    });
}
