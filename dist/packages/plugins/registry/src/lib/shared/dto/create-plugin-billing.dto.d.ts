import { PluginBillingPeriod, PluginBillingStatus } from '@gauzy/contracts';
import { IPluginBillingCreateInput } from '../models';
export declare class CreatePluginBillingDTO implements IPluginBillingCreateInput {
    readonly subscriptionId: string;
    readonly amount: number;
    readonly currency: string;
    readonly billingDate: Date;
    readonly dueDate: Date;
    readonly paymentDueDate?: Date;
    readonly status: PluginBillingStatus;
    readonly billingPeriod: PluginBillingPeriod;
    readonly billingPeriodStart: Date;
    readonly billingPeriodEnd: Date;
    readonly invoiceNumber?: string;
    readonly invoiceUrl?: string;
    readonly taxAmount?: number;
    readonly taxRate?: number;
    readonly discountAmount?: number;
    readonly discountCode?: string;
    readonly description?: string;
    readonly paymentReference?: string;
    readonly metadata?: Record<string, any>;
    readonly tenantId: string;
    readonly organizationId?: string;
}
