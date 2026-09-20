import { PluginBillingStatus } from '@gauzy/contracts';
import { IPluginBillingUpdateInput } from '../models';
export declare class UpdatePluginBillingDTO implements IPluginBillingUpdateInput {
    readonly amount?: number;
    readonly currency?: string;
    readonly billingDate?: Date;
    readonly dueDate?: Date;
    readonly paymentDueDate?: Date;
    readonly status?: PluginBillingStatus;
    readonly billingPeriodStart?: Date;
    readonly billingPeriodEnd?: Date;
    readonly invoiceNumber?: string;
    readonly invoiceUrl?: string;
    readonly taxAmount?: number;
    readonly taxRate?: number;
    readonly discountAmount?: number;
    readonly discountCode?: string;
    readonly description?: string;
    readonly paymentReference?: string;
    readonly metadata?: Record<string, any>;
}
