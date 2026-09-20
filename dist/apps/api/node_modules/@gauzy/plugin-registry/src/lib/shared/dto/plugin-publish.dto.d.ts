import { PluginBillingPeriod, PluginPricingType } from '@gauzy/contracts';
export declare class PluginPricingDTO {
    type: PluginPricingType;
    price?: number;
    currency?: string;
    billingPeriod?: PluginBillingPeriod;
    trialPeriodDays?: number;
}
export declare class PublishPluginDTO {
    name: string;
    description: string;
    version: string;
    categoryId?: string;
    tags?: string[];
    pricing: PluginPricingDTO;
    iconUrl?: string;
    screenshots?: string[];
    documentationUrl?: string;
    supportUrl?: string;
    websiteUrl?: string;
    license?: string;
    autoPublish?: boolean;
    releaseNotes?: string;
}
