import { CurrenciesEnum, ID, PluginBillingPeriod, PluginSubscriptionType } from '@gauzy/contracts';
/**
 * Base class for subscription plan fields with transformations
 */
declare class BaseSubscriptionPlanFieldsDTO {
    price: number;
    isPopular?: boolean;
    isRecommended?: boolean;
    trialDays?: number;
    setupFee?: number;
    discountPercentage?: number;
}
/**
 * Create Plugin Subscription Plan DTO
 */
export declare class CreatePluginSubscriptionPlanDTO extends BaseSubscriptionPlanFieldsDTO {
    name: string;
    description?: string;
    type: PluginSubscriptionType;
    currency: CurrenciesEnum;
    billingPeriod: PluginBillingPeriod;
    features: string[];
    limitations?: Record<string, any>;
    isActive: boolean;
    metadata?: Record<string, any>;
    sortOrder?: number;
    pluginId?: ID;
}
/**
 * Update Plugin Subscription Plan DTO
 */
export declare class UpdatePluginSubscriptionPlanDTO {
    readonly id?: ID;
    price?: number;
    isPopular?: boolean;
    isRecommended?: boolean;
    trialDays?: number;
    setupFee?: number;
    discountPercentage?: number;
    name?: string;
    description?: string;
    type?: PluginSubscriptionType;
    currency?: CurrenciesEnum;
    billingPeriod?: PluginBillingPeriod;
    features?: string[];
    limitations?: Record<string, any>;
    isActive?: boolean;
    metadata?: Record<string, any>;
    sortOrder?: number;
}
/**
 * Plugin Subscription Plan Query DTO
 */
export declare class PluginSubscriptionPlanQueryDTO {
    pluginId?: string;
    type?: PluginSubscriptionType;
    billingPeriod?: PluginBillingPeriod;
    isActive?: boolean;
    isPopular?: boolean;
    isRecommended?: boolean;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
    hasTrial?: boolean;
}
/**
 * Plugin Plan Features DTO
 */
export declare class PluginPlanFeaturesDTO {
    features: string[];
    limitations?: Record<string, any>;
}
/**
 * Plugin Plan Pricing DTO
 */
export declare class PluginPlanPricingDTO {
    price: number;
    currency: string;
    billingPeriod: PluginBillingPeriod;
    setupFee?: number;
    discountPercentage?: number;
    trialDays?: number;
}
/**
 * Plugin Plan Bulk Operations DTO
 */
export declare class BulkPluginPlanOperationDTO {
    planIds: string[];
    operation: 'activate' | 'deactivate' | 'delete';
}
/**
 * Plugin Plan Copy DTO
 */
export declare class CopyPluginPlanDTO {
    sourcePlanId: string;
    newName: string;
    newDescription?: string;
    newPrice?: number;
}
/**
 * Plugin Plan Analytics DTO
 */
export declare class PluginPlanAnalyticsDTO {
    planId: string;
    dateFrom?: string;
    dateTo?: string;
    metrics?: string[];
}
export {};
