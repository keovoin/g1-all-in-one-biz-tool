import { IPluginSubscriptionPlan, IUser, PluginScope, PluginSubscriptionStatus } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import type { IPluginBilling } from '../../shared/models';
import type { IPluginSubscription } from '../../shared/models/plugin-subscription.model';
import type { IPluginTenant } from '../../shared/models/plugin-tenant.model';
import type { IPlugin } from '../../shared/models/plugin.model';
export declare class PluginSubscription extends TenantOrganizationBaseEntity implements IPluginSubscription {
    status: PluginSubscriptionStatus;
    scope: PluginScope;
    startDate: Date;
    endDate?: Date;
    trialEndDate?: Date;
    autoRenew: boolean;
    cancelledAt?: Date;
    cancellationReason?: string;
    metadata?: Record<string, any>;
    externalSubscriptionId?: string;
    pluginId: string;
    plugin: Relation<IPlugin>;
    pluginTenantId: string;
    pluginTenant: Relation<IPluginTenant>;
    planId?: string;
    plan?: Relation<IPluginSubscriptionPlan>;
    subscriberId?: string;
    subscriber?: Relation<IUser>;
    /**
     * Parent subscription ID - References the tenant/organization subscription that spawned this user subscription
     * Only set for user subscriptions created through assignment from a parent subscription
     */
    parentId?: string;
    /**
     * Parent subscription relationship
     * The tenant/organization subscription that this user subscription was derived from
     */
    parent?: Relation<IPluginSubscription>;
    /**
     * Child subscriptions relationship
     * User subscriptions that were created through assignment from this tenant/organization subscription
     */
    children?: Relation<IPluginSubscription[]>;
    billings?: Relation<IPluginBilling[]>;
    /**
     * Check if the subscription is currently active
     */
    get isSubscriptionActive(): boolean;
    /**
     * Check if the subscription is expired
     */
    get isExpired(): boolean;
    /**
     * Check if the subscription is in trial period
     */
    get isInTrial(): boolean;
    /**
     * Check if the subscription is expiring soon (within 7 days)
     */
    get isExpiringSoon(): boolean;
    /**
     * Get days remaining until expiration
     */
    get daysUntilExpiration(): number | null;
    /**
     * Get next billing date from pending billings
     * This is a computed property that looks at the billing records
     */
    get nextBillingDate(): Date | null;
    /**
     * Check if billing is due
     * This checks if there are any pending billings that are due
     */
    get isBillingDue(): boolean;
    /**
     * Validates if the subscription can be activated
     * Domain method to encapsulate business rules
     */
    canBeActivated(): boolean;
    /**
     * Validates if the subscription can be suspended
     */
    canBeSuspended(): boolean;
    /**
     * Validates if the subscription can be cancelled
     */
    canBeCancelled(): boolean;
    /**
     * Validates if the subscription can be renewed
     */
    canBeRenewed(): boolean;
    /**
     * Validates if the subscription can be upgraded
     */
    canBeUpgraded(): boolean;
    /**
     * Validates if the subscription can be downgraded
     */
    canBeDowngraded(): boolean;
    /**
     * Validates if trial can be extended
     */
    canExtendTrial(): boolean;
    /**
     * Validates if child subscriptions can be created from this subscription
     */
    canCreateChildSubscriptions(): boolean;
    /**
     * Validates if this is a valid parent subscription
     */
    isValidParentSubscription(): boolean;
    /**
     * Validates assignment permissions based on scope
     */
    hasAssignmentPermissions(): boolean;
    /**
     * Activates the subscription
     * Returns the updated subscription with new status
     */
    activate(): PluginSubscription;
    /**
     * Suspends the subscription
     */
    suspend(reason?: string): PluginSubscription;
    /**
     * Cancels the subscription
     */
    cancel(reason?: string): PluginSubscription;
    /**
     * Expires the subscription
     */
    expire(): PluginSubscription;
    /**
     * Renews the subscription with new end date
     */
    renew(newEndDate: Date): PluginSubscription;
    /**
     * Extends trial period
     */
    extendTrial(additionalDays: number, extendedBy?: string): PluginSubscription;
    /**
     * Upgrades subscription to new plan
     */
    upgradeToPlan(newPlanId: string): PluginSubscription;
    /**
     * Downgrades subscription to new plan
     */
    downgradeToPlan(newPlanId: string): PluginSubscription;
    /**
     * Checks if this subscription grants access to a specific user
     * Implements scope-based access control logic
     */
    grantsAccessToUser(userId: string, organizationId?: string): boolean;
    /**
     * Checks if this subscription allows creating child subscriptions
     */
    allowsChildCreation(): boolean;
    /**
     * Checks if user can manage this subscription (cancel, upgrade, etc.)
     */
    canBeManagedByUser(userId: string, organizationId?: string): boolean;
    /**
     * Checks if subscription is inherited (child subscription)
     */
    isInherited(): boolean;
    /**
     * Checks if this subscription can assign access to other users
     */
    canAssignToUsers(): boolean;
    /**
     * Gets the effective scope for permission checking
     * Takes into account parent-child relationships
     */
    getEffectiveScope(): PluginScope;
    /**
     * Checks if subscription grants elevated permissions
     */
    hasElevatedPermissions(): boolean;
    /**
     * Creates a free subscription for immediate access
     * Static factory method following Factory pattern
     */
    static createFreeSubscription(pluginId: string, pluginTenantId: string, tenantId: string, subscriberId?: string, organizationId?: string): PluginSubscription;
    /**
     * Creates a trial subscription
     */
    static createTrialSubscription(pluginId: string, pluginTenantId: string, tenantId: string, planId: string, trialDays: number, scope: PluginScope, subscriberId?: string, organizationId?: string): PluginSubscription;
    /**
     * Creates a paid subscription
     */
    static createPaidSubscription(pluginId: string, pluginTenantId: string, tenantId: string, planId: string, scope: PluginScope, endDate: Date, subscriberId?: string, organizationId?: string, paymentMethod?: string): PluginSubscription;
    /**
     * Creates a child subscription from a parent subscription
     */
    static createChildSubscription(parentSubscription: IPluginSubscription, subscriberId: string): PluginSubscription;
    /**
     * Calculates the next billing date based on billing period
     */
    calculateNextBillingDate(billingPeriod: string): Date;
    /**
     * Calculates remaining subscription time in days
     */
    calculateRemainingDays(): number;
    /**
     * Calculates prorated amount for upgrades/downgrades
     */
    calculateProratedAmount(oldPrice: number, newPrice: number): number;
    /**
     * Calculates total subscription days for current period
     */
    private getTotalSubscriptionDays;
    /**
     * Calculates usage percentage of current subscription period
     */
    calculateUsagePercentage(): number;
    /**
     * Calculates credit amount for downgrade or cancellation
     */
    calculateCreditAmount(pricePerPeriod: number): number;
    /**
     * Determines if subscription qualifies for refund
     */
    qualifiesForRefund(refundPolicyDays?: number): boolean;
    /**
     * Calculates renewal price with potential discounts
     */
    calculateRenewalPrice(basePrice: number, loyaltyDiscountPercentage?: number): number;
    /**
     * Gets the number of times this subscription has been renewed
     */
    private getRenewalCount;
    /**
     * Specification to check if subscription is active and accessible
     * Implements Specification pattern for complex business rules
     */
    static isActiveAndAccessible(subscription: IPluginSubscription): boolean;
    /**
     * Specification to check if subscription is expiring soon
     */
    static isExpiringSoon(subscription: IPluginSubscription, warningDays?: number): boolean;
    /**
     * Specification to check if subscription requires payment attention
     */
    static requiresPaymentAttention(subscription: IPluginSubscription): boolean;
    /**
     * Specification to check if subscription is eligible for renewal
     */
    static isEligibleForRenewal(subscription: IPluginSubscription): boolean;
    /**
     * Specification to check if subscription can manage users
     */
    static canManageUsers(subscription: IPluginSubscription): boolean;
    /**
     * Specification to check if subscription is a billable subscription
     */
    static isBillable(subscription: IPluginSubscription): boolean;
    /**
     * Specification to check if subscription grants premium features
     */
    static grantsPremiumFeatures(subscription: IPluginSubscription): boolean;
    /**
     * Specification to check if subscription is inherited from parent
     */
    static isInherited(subscription: IPluginSubscription): boolean;
    /**
     * Specification to check if subscription needs billing attention
     */
    static needsBillingAttention(subscription: IPluginSubscription): boolean;
    /**
     * Builds query criteria for finding similar subscriptions
     */
    getSimilarSubscriptionCriteria(): Partial<IPluginSubscription>;
    /**
     * Builds query criteria for finding related subscriptions
     */
    getRelatedSubscriptionCriteria(): Partial<IPluginSubscription>;
    /**
     * Gets subscription hierarchy path (parent -> child relationships)
     */
    getHierarchyPath(): string[];
}
