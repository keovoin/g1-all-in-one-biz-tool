import { IUser, PluginBillingPeriod, PluginSubscriptionType } from '@gauzy/contracts';
import { BaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import type { IPluginSubscription, IPluginSubscriptionPlan } from '../../shared/';
import type { IPlugin } from '../../shared/models/plugin.model';
export declare class PluginSubscriptionPlan extends BaseEntity implements IPluginSubscriptionPlan {
    name: string;
    description?: string;
    type: PluginSubscriptionType;
    price: number;
    currency: string;
    billingPeriod: PluginBillingPeriod;
    features: string[];
    limitations?: Record<string, any>;
    isActive: boolean;
    isPopular?: boolean;
    isRecommended?: boolean;
    trialDays?: number;
    setupFee?: number;
    discountPercentage?: number;
    metadata?: Record<string, any>;
    sortOrder?: number;
    pluginId: string;
    plugin: Relation<IPlugin>;
    createdById?: string;
    createdBy?: Relation<IUser>;
    subscriptions?: Relation<IPluginSubscription[]>;
    /**
     * Check if the plan is free
     */
    get isFree(): boolean;
    /**
     * Check if the plan offers a trial
     */
    get hasTrial(): boolean;
    /**
     * Get the effective price (with discount applied)
     */
    get effectivePrice(): number;
    /**
     * Get discount amount
     */
    get discountAmount(): number;
    /**
     * Get total price including setup fee
     */
    get totalPrice(): number;
    /**
     * Check if plan has any limitations
     */
    get hasLimitations(): boolean;
    /**
     * Get formatted price string
     */
    getFormattedPrice(): string;
    /**
     * Get billing period display text
     */
    getBillingPeriodText(): string;
    /**
     * Create a new subscription plan instance
     */
    static create(plan: Partial<IPluginSubscriptionPlan>): PluginSubscriptionPlan;
    /**
     * Create a free plan template
     */
    static createFreePlan(pluginId: string, features?: string[], name?: string): PluginSubscriptionPlan;
    /**
     * Create a basic plan template
     */
    static createBasicPlan(pluginId: string, price: number, currency?: string, features?: string[], name?: string): PluginSubscriptionPlan;
    /**
     * Create a pro plan template
     */
    static createProPlan(pluginId: string, price: number, currency?: string, features?: string[], name?: string): PluginSubscriptionPlan;
    /**
     * Create an enterprise plan template
     */
    static createEnterprisePlan(pluginId: string, price: number, currency?: string, features?: string[], name?: string): PluginSubscriptionPlan;
    /**
     * Calculate monthly equivalent price for any billing period
     */
    static calculateMonthlyEquivalent(price: number, billingPeriod: PluginBillingPeriod): number;
    /**
     * Compare plans by effective monthly price
     */
    static comparePlans(plan1: IPluginSubscriptionPlan, plan2: IPluginSubscriptionPlan): number;
    /**
     * Sort plans by type order
     */
    static getSortOrderByType(type: PluginSubscriptionType): number;
    /**
     * Validate plan pricing
     */
    static validatePricing(price: number, billingPeriod: PluginBillingPeriod, setupFee?: number): boolean;
    /**
     * Check if a plan offers better value than another (based on monthly equivalent)
     */
    static isBetterValue(plan1: IPluginSubscriptionPlan, plan2: IPluginSubscriptionPlan): boolean;
    /**
     * Calculate annual savings for yearly vs monthly billing
     */
    static calculateAnnualSavings(yearlyPlan: IPluginSubscriptionPlan, monthlyPlan: IPluginSubscriptionPlan): number;
    /**
     * Calculate savings percentage for yearly vs monthly
     */
    static calculateSavingsPercentage(yearlyPlan: IPluginSubscriptionPlan, monthlyPlan: IPluginSubscriptionPlan): number;
    /**
     * Check if plan has a specific feature
     */
    static hasFeature(plan: IPluginSubscriptionPlan, feature: string): boolean;
    /**
     * Create a custom plan builder
     */
    static builder(pluginId: string): PluginSubscriptionPlanBuilder;
}
/**
 * Builder class for creating subscription plans
 */
export declare class PluginSubscriptionPlanBuilder {
    private plan;
    constructor(pluginId: string);
    withName(name: string): this;
    withDescription(description: string): this;
    withType(type: PluginSubscriptionType): this;
    withPrice(price: number): this;
    withCurrency(currency: string): this;
    withBillingPeriod(period: PluginBillingPeriod): this;
    withFeatures(features: string[]): this;
    addFeature(feature: string): this;
    withLimitations(limitations: Record<string, any>): this;
    withTrialDays(days: number): this;
    withSetupFee(fee: number): this;
    withDiscount(percentage: number): this;
    asPopular(): this;
    asRecommended(): this;
    withSortOrder(order: number): this;
    withMetadata(metadata: Record<string, any>): this;
    setActive(active: boolean): this;
    build(): PluginSubscriptionPlan;
}
