import { ID, PluginBillingPeriod, PluginBillingStatus } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import { IPluginBilling } from '../../shared/models/plugin-billing.model';
import { IPluginSubscription } from '../../shared/models/plugin-subscription.model';
export declare class PluginBilling extends TenantOrganizationBaseEntity implements IPluginBilling {
    amount: number;
    currency: string;
    billingDate: Date;
    dueDate: Date;
    status: PluginBillingStatus;
    billingPeriod: PluginBillingPeriod;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    description?: string;
    metadata?: Record<string, any>;
    subscriptionId: ID;
    subscription: Relation<IPluginSubscription>;
    /**
     * Check if billing is overdue
     */
    get isOverdue(): boolean;
    /**
     * Check if billing is pending
     */
    get isPending(): boolean;
    /**
     * Get days until due date
     */
    get daysUntilDue(): number;
}
