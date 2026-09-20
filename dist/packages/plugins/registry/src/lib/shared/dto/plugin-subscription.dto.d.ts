import { ID, PluginBillingPeriod, PluginScope, PluginSubscriptionStatus, PluginSubscriptionType } from '@gauzy/contracts';
/**
 * Create Plugin Subscription DTO
 */
export declare class CreatePluginSubscriptionDTO {
    pluginId: ID;
    subscriptionPlanId: ID;
    scope: PluginScope;
    pluginTenantId: ID;
    status: PluginSubscriptionStatus;
    startDate?: string;
    endDate?: string;
    trialEndDate?: string;
    autoRenew: boolean;
    metadata?: Record<string, any>;
}
/**
 * Update Plugin Subscription DTO
 */
export declare class UpdatePluginSubscriptionDTO {
    status?: PluginSubscriptionStatus;
    startDate?: string;
    endDate?: string;
    trialEndDate?: string;
    autoRenew?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Plugin Subscription Query DTO
 */
export declare class PluginSubscriptionQueryDTO {
    pluginId?: string;
    pluginTenantId?: string;
    subscriberId?: string;
    status?: PluginSubscriptionStatus;
    subscriptionType?: PluginSubscriptionType;
    scope?: PluginScope;
}
/**
 * Purchase Plugin Subscription DTO
 */
export declare class PurchasePluginSubscriptionDTO {
    pluginId: string;
    planId?: string;
    scope: PluginScope;
    autoRenew: boolean;
    paymentMethod?: string;
    promoCode?: string;
    metadata?: Record<string, any>;
}
/**
 * Cancel Plugin Subscription DTO
 */
export declare class CancelPluginSubscriptionDTO {
    reason?: string;
}
/**
 * Renew Plugin Subscription DTO
 */
export declare class RenewPluginSubscriptionDTO {
    billingPeriod?: PluginBillingPeriod;
    paymentMethod?: string;
}
/**
 * Plugin Access Check DTO
 */
export declare class PluginAccessCheckDTO {
    pluginId: string;
    subscriberId?: string;
}
/**
 * Subscription Billing DTO
 */
export declare class SubscriptionBillingDTO {
    amount: number;
    currency: string;
    billingDate: string;
    paymentMethod?: string;
    invoiceUrl?: string;
}
