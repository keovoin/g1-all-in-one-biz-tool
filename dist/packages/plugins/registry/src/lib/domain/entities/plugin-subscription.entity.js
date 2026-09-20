"use strict";
var PluginSubscription_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscription = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_billing_entity_1 = require("./plugin-billing.entity");
const plugin_subscription_plan_entity_1 = require("./plugin-subscription-plan.entity");
const plugin_tenant_entity_1 = require("./plugin-tenant.entity");
const plugin_entity_1 = require("./plugin.entity");
let PluginSubscription = PluginSubscription_1 = class PluginSubscription extends core_1.TenantOrganizationBaseEntity {
    /*
     * Payment relationships - will be added when Payment entity is available
     * @MultiORMOneToMany(() => Payment, (payment) => payment.pluginSubscription, { onDelete: 'SET NULL' })
     * payments?: IPayment[];
     */
    /**
     * Check if the subscription is currently active
     */
    get isSubscriptionActive() {
        return ([
            contracts_1.PluginSubscriptionStatus.ACTIVE,
            contracts_1.PluginSubscriptionStatus.TRIAL,
            contracts_1.PluginSubscriptionStatus.PENDING
        ].includes(this.status) &&
            (!this.endDate || this.endDate > new Date()));
    }
    /**
     * Check if the subscription is expired
     */
    get isExpired() {
        return this.endDate ? this.endDate <= new Date() : false;
    }
    /**
     * Check if the subscription is in trial period
     */
    get isInTrial() {
        return this.trialEndDate ? this.trialEndDate > new Date() : false;
    }
    /**
     * Check if the subscription is expiring soon (within 7 days)
     */
    get isExpiringSoon() {
        if (!this.endDate)
            return false;
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        return this.endDate <= sevenDaysFromNow && this.endDate > new Date();
    }
    /**
     * Get days remaining until expiration
     */
    get daysUntilExpiration() {
        if (!this.endDate)
            return null;
        const now = new Date();
        const timeDiff = this.endDate.getTime() - now.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    /**
     * Get next billing date from pending billings
     * This is a computed property that looks at the billing records
     */
    get nextBillingDate() {
        if (!this.billings || this.billings.length === 0)
            return null;
        const pendingBillings = this.billings
            .filter((b) => b.status === contracts_1.PluginBillingStatus.PENDING && b.dueDate > new Date())
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
        return pendingBillings.length > 0 ? pendingBillings[0].dueDate : null;
    }
    /**
     * Check if billing is due
     * This checks if there are any pending billings that are due
     */
    get isBillingDue() {
        if (!this.billings || this.billings.length === 0)
            return false;
        const now = new Date();
        return this.billings.some((b) => b.status === 'pending' && b.dueDate <= now);
    }
    // ==========================================
    // DOMAIN VALIDATION METHODS
    // ==========================================
    /**
     * Validates if the subscription can be activated
     * Domain method to encapsulate business rules
     */
    canBeActivated() {
        return [
            contracts_1.PluginSubscriptionStatus.PENDING,
            contracts_1.PluginSubscriptionStatus.SUSPENDED,
            contracts_1.PluginSubscriptionStatus.TRIAL
        ].includes(this.status);
    }
    /**
     * Validates if the subscription can be suspended
     */
    canBeSuspended() {
        return [contracts_1.PluginSubscriptionStatus.ACTIVE, contracts_1.PluginSubscriptionStatus.TRIAL].includes(this.status);
    }
    /**
     * Validates if the subscription can be cancelled
     */
    canBeCancelled() {
        return this.status !== contracts_1.PluginSubscriptionStatus.CANCELLED;
    }
    /**
     * Validates if the subscription can be renewed
     */
    canBeRenewed() {
        return ([contracts_1.PluginSubscriptionStatus.ACTIVE, contracts_1.PluginSubscriptionStatus.EXPIRED].includes(this.status) && this.autoRenew);
    }
    /**
     * Validates if the subscription can be upgraded
     */
    canBeUpgraded() {
        return this.status === contracts_1.PluginSubscriptionStatus.ACTIVE && !!this.planId && !this.isInherited();
    }
    /**
     * Validates if the subscription can be downgraded
     */
    canBeDowngraded() {
        return this.status === contracts_1.PluginSubscriptionStatus.ACTIVE && !!this.planId && !this.isInherited();
    }
    /**
     * Validates if trial can be extended
     */
    canExtendTrial() {
        return (this.status === contracts_1.PluginSubscriptionStatus.TRIAL &&
            this.trialEndDate &&
            this.trialEndDate > new Date() &&
            !this.isInherited());
    }
    /**
     * Validates if child subscriptions can be created from this subscription
     */
    canCreateChildSubscriptions() {
        return (this.status === contracts_1.PluginSubscriptionStatus.ACTIVE &&
            [contracts_1.PluginScope.TENANT, contracts_1.PluginScope.ORGANIZATION].includes(this.scope) &&
            !this.isInherited());
    }
    /**
     * Validates if this is a valid parent subscription
     */
    isValidParentSubscription() {
        return ([contracts_1.PluginScope.TENANT, contracts_1.PluginScope.ORGANIZATION].includes(this.scope) &&
            [contracts_1.PluginSubscriptionStatus.ACTIVE, contracts_1.PluginSubscriptionStatus.TRIAL].includes(this.status));
    }
    /**
     * Validates assignment permissions based on scope
     */
    hasAssignmentPermissions() {
        return [contracts_1.PluginScope.ORGANIZATION, contracts_1.PluginScope.TENANT].includes(this.scope) && this.isSubscriptionActive;
    }
    // ==========================================
    // DOMAIN LIFECYCLE METHODS
    // ==========================================
    /**
     * Activates the subscription
     * Returns the updated subscription with new status
     */
    activate() {
        if (!this.canBeActivated()) {
            throw new Error(`Cannot activate subscription in ${this.status} status`);
        }
        this.status = contracts_1.PluginSubscriptionStatus.ACTIVE;
        this.updatedAt = new Date();
        return this;
    }
    /**
     * Suspends the subscription
     */
    suspend(reason) {
        if (!this.canBeSuspended()) {
            throw new Error(`Cannot suspend subscription in ${this.status} status`);
        }
        this.status = contracts_1.PluginSubscriptionStatus.SUSPENDED;
        if (reason) {
            this.metadata = {
                ...this.metadata,
                suspensionReason: reason,
                suspendedAt: new Date().toISOString()
            };
        }
        this.updatedAt = new Date();
        return this;
    }
    /**
     * Cancels the subscription
     */
    cancel(reason) {
        if (!this.canBeCancelled()) {
            throw new Error('Cannot cancel subscription that is already cancelled');
        }
        this.status = contracts_1.PluginSubscriptionStatus.CANCELLED;
        this.planId = null;
        this.cancelledAt = new Date();
        this.cancellationReason = reason;
        this.autoRenew = false;
        this.updatedAt = new Date();
        this.pluginTenant.removeAllowedUser(this.subscriberId);
        return this;
    }
    /**
     * Expires the subscription
     */
    expire() {
        this.status = contracts_1.PluginSubscriptionStatus.EXPIRED;
        this.updatedAt = new Date();
        return this;
    }
    /**
     * Renews the subscription with new end date
     */
    renew(newEndDate) {
        if (!this.canBeRenewed()) {
            throw new Error(`Cannot renew subscription in ${this.status} status`);
        }
        this.status = contracts_1.PluginSubscriptionStatus.ACTIVE;
        this.endDate = newEndDate;
        this.metadata = {
            ...this.metadata,
            lastRenewalDate: new Date().toISOString()
        };
        this.updatedAt = new Date();
        return this;
    }
    /**
     * Extends trial period
     */
    extendTrial(additionalDays, extendedBy) {
        if (!this.canExtendTrial()) {
            throw new Error('Cannot extend trial for this subscription');
        }
        const currentTrialEnd = this.trialEndDate || new Date();
        const newTrialEnd = new Date(currentTrialEnd);
        newTrialEnd.setDate(newTrialEnd.getDate() + additionalDays);
        this.trialEndDate = newTrialEnd;
        this.metadata = {
            ...this.metadata,
            trialExtended: true,
            extensionDays: additionalDays,
            extendedAt: new Date().toISOString(),
            ...(extendedBy && { extendedBy })
        };
        this.updatedAt = new Date();
        return this;
    }
    /**
     * Upgrades subscription to new plan
     */
    upgradeToPlan(newPlanId) {
        if (!this.canBeUpgraded()) {
            throw new Error('Cannot upgrade subscription in current state');
        }
        this.metadata = {
            ...this.metadata,
            previousPlanId: this.planId,
            upgradedAt: new Date().toISOString(),
            upgradeReason: 'user_requested'
        };
        this.planId = newPlanId;
        this.updatedAt = new Date();
        return this;
    }
    /**
     * Downgrades subscription to new plan
     */
    downgradeToPlan(newPlanId) {
        if (!this.canBeDowngraded()) {
            throw new Error('Cannot downgrade subscription in current state');
        }
        this.metadata = {
            ...this.metadata,
            previousPlanId: this.planId,
            downgradedAt: new Date().toISOString(),
            downgradeReason: 'user_requested'
        };
        this.planId = newPlanId;
        this.updatedAt = new Date();
        return this;
    }
    // ==========================================
    // DOMAIN PERMISSION METHODS
    // ==========================================
    /**
     * Checks if this subscription grants access to a specific user
     * Implements scope-based access control logic
     */
    grantsAccessToUser(userId, organizationId) {
        if (!this.isSubscriptionActive)
            return false;
        switch (this.scope) {
            case contracts_1.PluginScope.USER:
                return this.subscriberId === userId;
            case contracts_1.PluginScope.ORGANIZATION:
                return this.organizationId === organizationId;
            case contracts_1.PluginScope.TENANT:
                // Tenant scope grants access to all users in the tenant
                return true;
            default:
                return false;
        }
    }
    /**
     * Checks if this subscription allows creating child subscriptions
     */
    allowsChildCreation() {
        return this.canCreateChildSubscriptions() && !this.parent;
    }
    /**
     * Checks if user can manage this subscription (cancel, upgrade, etc.)
     */
    canBeManagedByUser(userId, organizationId) {
        if (!userId)
            return false;
        // User scope subscriptions cannot be managed by others
        if (this.scope === contracts_1.PluginScope.USER) {
            return this.subscriberId === userId && !this.parentId;
        }
        // For organization scope, check if user belongs to the organization
        if (this.scope === contracts_1.PluginScope.ORGANIZATION) {
            return this.organizationId === organizationId;
        }
        // For tenant scope, organization admins can manage
        if (this.scope === contracts_1.PluginScope.TENANT) {
            return !!organizationId; // Assume organization presence indicates admin rights
        }
        return false;
    }
    /**
     * Checks if subscription is inherited (child subscription)
     */
    isInherited() {
        return !!this.parentId;
    }
    /**
     * Checks if this subscription can assign access to other users
     */
    canAssignToUsers() {
        return this.hasAssignmentPermissions() && !this.isInherited();
    }
    /**
     * Gets the effective scope for permission checking
     * Takes into account parent-child relationships
     */
    getEffectiveScope() {
        if (this.parent && this.parent.scope) {
            return this.parent.scope;
        }
        return this.scope;
    }
    /**
     * Checks if subscription grants elevated permissions
     */
    hasElevatedPermissions() {
        return [contracts_1.PluginScope.ORGANIZATION, contracts_1.PluginScope.TENANT].includes(this.getEffectiveScope());
    }
    // ==========================================
    // DOMAIN FACTORY METHODS
    // ==========================================
    /**
     * Creates a free subscription for immediate access
     * Static factory method following Factory pattern
     */
    static createFreeSubscription(pluginId, pluginTenantId, tenantId, subscriberId, organizationId) {
        const subscription = new PluginSubscription_1();
        subscription.pluginId = pluginId;
        subscription.pluginTenantId = pluginTenantId;
        subscription.tenantId = tenantId;
        subscription.organizationId = organizationId;
        subscription.subscriberId = subscriberId;
        subscription.status = contracts_1.PluginSubscriptionStatus.ACTIVE;
        subscription.scope = contracts_1.PluginScope.USER; // Free subscriptions are user-scoped
        subscription.startDate = new Date();
        subscription.autoRenew = false; // Free subscriptions don't auto-renew
        subscription.metadata = {
            isFree: true,
            createdAt: new Date().toISOString(),
            subscriptionType: 'free'
        };
        return subscription;
    }
    /**
     * Creates a trial subscription
     */
    static createTrialSubscription(pluginId, pluginTenantId, tenantId, planId, trialDays, scope, subscriberId, organizationId) {
        const subscription = new PluginSubscription_1();
        subscription.pluginId = pluginId;
        subscription.pluginTenantId = pluginTenantId;
        subscription.tenantId = tenantId;
        subscription.organizationId = organizationId;
        subscription.subscriberId = subscriberId;
        subscription.planId = planId;
        subscription.status = contracts_1.PluginSubscriptionStatus.TRIAL;
        subscription.scope = scope;
        subscription.startDate = new Date();
        subscription.autoRenew = true;
        // Calculate trial end date
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + trialDays);
        subscription.trialEndDate = trialEndDate;
        subscription.metadata = {
            isTrial: true,
            trialDays,
            createdAt: new Date().toISOString(),
            subscriptionType: 'trial'
        };
        return subscription;
    }
    /**
     * Creates a paid subscription
     */
    static createPaidSubscription(pluginId, pluginTenantId, tenantId, planId, scope, endDate, subscriberId, organizationId, paymentMethod) {
        const subscription = new PluginSubscription_1();
        subscription.pluginId = pluginId;
        subscription.pluginTenantId = pluginTenantId;
        subscription.tenantId = tenantId;
        subscription.organizationId = organizationId;
        subscription.subscriberId = subscriberId;
        subscription.planId = planId;
        subscription.status = contracts_1.PluginSubscriptionStatus.PENDING; // Awaiting payment
        subscription.scope = scope;
        subscription.startDate = new Date();
        subscription.endDate = endDate;
        subscription.autoRenew = true;
        subscription.metadata = {
            isPaid: true,
            paymentMethod,
            createdAt: new Date().toISOString(),
            subscriptionType: 'paid'
        };
        return subscription;
    }
    /**
     * Creates a child subscription from a parent subscription
     */
    static createChildSubscription(parentSubscription, subscriberId) {
        // Validate parent subscription can create children
        const canCreate = [
            contracts_1.PluginSubscriptionStatus.ACTIVE,
            contracts_1.PluginSubscriptionStatus.TRIAL,
            contracts_1.PluginSubscriptionStatus.PENDING
        ].includes(parentSubscription.status) &&
            [contracts_1.PluginScope.TENANT, contracts_1.PluginScope.ORGANIZATION].includes(parentSubscription.scope);
        if (!canCreate) {
            throw new Error('Cannot create child subscription from parent');
        }
        const subscription = new PluginSubscription_1();
        subscription.pluginId = parentSubscription.pluginId;
        subscription.pluginTenantId = parentSubscription.pluginTenantId;
        subscription.tenantId = parentSubscription.tenantId;
        subscription.organizationId = parentSubscription.organizationId;
        subscription.subscriberId = subscriberId;
        subscription.planId = parentSubscription.planId;
        subscription.parentId = parentSubscription.id;
        subscription.status = contracts_1.PluginSubscriptionStatus.ACTIVE; // Inherit from parent
        subscription.scope = contracts_1.PluginScope.USER; // Child subscriptions are always user-scoped
        subscription.startDate = new Date();
        subscription.endDate = parentSubscription.endDate;
        subscription.trialEndDate = parentSubscription.trialEndDate;
        subscription.autoRenew = false; // Children don't auto-renew independently
        subscription.metadata = {
            createdFrom: 'assignment',
            parentSubscriptionId: parentSubscription.id,
            assignedAt: new Date().toISOString(),
            subscriptionType: 'child'
        };
        return subscription;
    }
    // ==========================================
    // DOMAIN CALCULATION METHODS
    // ==========================================
    /**
     * Calculates the next billing date based on billing period
     */
    calculateNextBillingDate(billingPeriod) {
        const currentDate = this.endDate || new Date();
        const nextDate = new Date(currentDate);
        switch (billingPeriod.toLowerCase()) {
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            case 'quarterly':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            default:
                throw new Error(`Unsupported billing period: ${billingPeriod}`);
        }
        return nextDate;
    }
    /**
     * Calculates remaining subscription time in days
     */
    calculateRemainingDays() {
        if (!this.endDate)
            return Infinity; // No expiration
        const now = new Date();
        const timeDiff = this.endDate.getTime() - now.getTime();
        return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    }
    /**
     * Calculates prorated amount for upgrades/downgrades
     */
    calculateProratedAmount(oldPrice, newPrice) {
        const remainingDays = this.calculateRemainingDays();
        if (remainingDays === 0 || remainingDays === Infinity)
            return 0;
        const totalDays = this.getTotalSubscriptionDays();
        if (totalDays === 0)
            return 0;
        const unusedRatio = remainingDays / totalDays;
        const oldUnusedValue = oldPrice * unusedRatio;
        const newValue = newPrice * unusedRatio;
        return Math.max(0, newValue - oldUnusedValue);
    }
    /**
     * Calculates total subscription days for current period
     */
    getTotalSubscriptionDays() {
        if (!this.endDate || !this.startDate)
            return 0;
        const timeDiff = this.endDate.getTime() - this.startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    /**
     * Calculates usage percentage of current subscription period
     */
    calculateUsagePercentage() {
        const totalDays = this.getTotalSubscriptionDays();
        const remainingDays = this.calculateRemainingDays();
        if (totalDays === 0 || remainingDays === Infinity)
            return 0;
        const usedDays = totalDays - remainingDays;
        return Math.min(100, Math.max(0, (usedDays / totalDays) * 100));
    }
    /**
     * Calculates credit amount for downgrade or cancellation
     */
    calculateCreditAmount(pricePerPeriod) {
        const remainingDays = this.calculateRemainingDays();
        const totalDays = this.getTotalSubscriptionDays();
        if (totalDays === 0 || remainingDays === 0 || remainingDays === Infinity) {
            return 0;
        }
        const unusedRatio = remainingDays / totalDays;
        return pricePerPeriod * unusedRatio;
    }
    /**
     * Determines if subscription qualifies for refund
     */
    qualifiesForRefund(refundPolicyDays = 30) {
        if (!this.startDate)
            return false;
        const daysSinceStart = Math.floor((new Date().getTime() - this.startDate.getTime()) / (1000 * 3600 * 24));
        return (daysSinceStart <= refundPolicyDays &&
            [contracts_1.PluginSubscriptionStatus.ACTIVE, contracts_1.PluginSubscriptionStatus.TRIAL].includes(this.status));
    }
    /**
     * Calculates renewal price with potential discounts
     */
    calculateRenewalPrice(basePrice, loyaltyDiscountPercentage = 0) {
        const renewalCount = this.getRenewalCount();
        const discount = Math.min(loyaltyDiscountPercentage * renewalCount, 50); // Max 50% discount
        return basePrice * (1 - discount / 100);
    }
    /**
     * Gets the number of times this subscription has been renewed
     */
    getRenewalCount() {
        return this.metadata?.renewalCount || 0;
    }
    // ==========================================
    // DOMAIN SPECIFICATION METHODS
    // ==========================================
    /**
     * Specification to check if subscription is active and accessible
     * Implements Specification pattern for complex business rules
     */
    static isActiveAndAccessible(subscription) {
        return ([contracts_1.PluginSubscriptionStatus.ACTIVE, contracts_1.PluginSubscriptionStatus.TRIAL].includes(subscription.status) &&
            (!subscription.endDate || subscription.endDate > new Date()));
    }
    /**
     * Specification to check if subscription is expiring soon
     */
    static isExpiringSoon(subscription, warningDays = 7) {
        if (!subscription.endDate)
            return false;
        const warningDate = new Date();
        warningDate.setDate(warningDate.getDate() + warningDays);
        return (subscription.endDate <= warningDate &&
            subscription.endDate > new Date() &&
            subscription.status === contracts_1.PluginSubscriptionStatus.ACTIVE);
    }
    /**
     * Specification to check if subscription requires payment attention
     */
    static requiresPaymentAttention(subscription) {
        return ([contracts_1.PluginSubscriptionStatus.PENDING, contracts_1.PluginSubscriptionStatus.SUSPENDED].includes(subscription.status) ||
            (subscription.status === contracts_1.PluginSubscriptionStatus.TRIAL &&
                subscription.trialEndDate &&
                subscription.trialEndDate <= new Date()));
    }
    /**
     * Specification to check if subscription is eligible for renewal
     */
    static isEligibleForRenewal(subscription) {
        return (subscription.autoRenew &&
            [contracts_1.PluginSubscriptionStatus.ACTIVE, contracts_1.PluginSubscriptionStatus.EXPIRED].includes(subscription.status) &&
            (!subscription.parent || subscription.parent.status === contracts_1.PluginSubscriptionStatus.ACTIVE));
    }
    /**
     * Specification to check if subscription can manage users
     */
    static canManageUsers(subscription) {
        return ([contracts_1.PluginScope.ORGANIZATION, contracts_1.PluginScope.TENANT].includes(subscription.scope) &&
            PluginSubscription_1.isActiveAndAccessible(subscription) &&
            !subscription.parentId);
    }
    /**
     * Specification to check if subscription is a billable subscription
     */
    static isBillable(subscription) {
        return (!!subscription.planId && subscription.status !== contracts_1.PluginSubscriptionStatus.CANCELLED && !subscription.parent); // Child subscriptions are not billed separately
    }
    /**
     * Specification to check if subscription grants premium features
     */
    static grantsPremiumFeatures(subscription) {
        return (PluginSubscription_1.isActiveAndAccessible(subscription) &&
            (!!subscription.planId || subscription.scope === contracts_1.PluginScope.TENANT));
    }
    /**
     * Specification to check if subscription is inherited from parent
     */
    static isInherited(subscription) {
        return !!subscription.parent && !!subscription.parentId && subscription.scope === contracts_1.PluginScope.USER;
    }
    /**
     * Specification to check if subscription needs billing attention
     */
    static needsBillingAttention(subscription) {
        const hasPendingPayments = subscription.billings?.some((billing) => billing.status === 'pending' && billing.dueDate <= new Date()) ||
            false;
        return (hasPendingPayments ||
            PluginSubscription_1.requiresPaymentAttention(subscription) ||
            (subscription.status === contracts_1.PluginSubscriptionStatus.ACTIVE &&
                subscription.endDate &&
                subscription.endDate <= new Date()));
    }
    // ==========================================
    // DOMAIN QUERY BUILDERS
    // ==========================================
    /**
     * Builds query criteria for finding similar subscriptions
     */
    getSimilarSubscriptionCriteria() {
        return {
            pluginId: this.pluginId,
            tenantId: this.tenantId,
            organizationId: this.organizationId,
            scope: this.scope
        };
    }
    /**
     * Builds query criteria for finding related subscriptions
     */
    getRelatedSubscriptionCriteria() {
        const criteria = {
            pluginId: this.pluginId,
            tenantId: this.tenantId
        };
        // Include organization if present
        if (this.organizationId) {
            criteria.organizationId = this.organizationId;
        }
        return criteria;
    }
    /**
     * Gets subscription hierarchy path (parent -> child relationships)
     */
    getHierarchyPath() {
        const path = [];
        if (this.parent) {
            // Recursive call would require the parent to be a PluginSubscription entity
            // For now, just add parent ID
            path.push(this.parentId);
        }
        path.push(this.id);
        return path;
    }
};
exports.PluginSubscription = PluginSubscription;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginSubscriptionStatus, description: 'Subscription status' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionStatus, { message: 'Invalid subscription status' }),
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginSubscriptionStatus,
        default: contracts_1.PluginSubscriptionStatus.PENDING
    }),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginScope, description: 'Subscription scope' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginScope, { message: 'Invalid plugin scope' }),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', enum: contracts_1.PluginScope, default: contracts_1.PluginScope.TENANT }),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, description: 'Start date of subscription' }),
    (0, class_validator_1.IsDate)({ message: 'Start date must be a valid date' }),
    (0, core_1.MultiORMColumn)({ default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], PluginSubscription.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date, description: 'End date of subscription' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'End date must be a valid date' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginSubscription.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date, description: 'Trial end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'Trial end date must be a valid date' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginSubscription.prototype, "trialEndDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether auto-renewal is enabled' }),
    (0, class_validator_1.IsBoolean)({ message: 'autoRenew must be a boolean' }),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: true }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscription.prototype, "autoRenew", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Date, description: 'Cancellation date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'Cancelled date must be a valid date' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginSubscription.prototype, "cancelledAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Cancellation reason' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Cancellation reason must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "cancellationReason", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Subscription metadata for additional data' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'External subscription ID from payment provider' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'External subscription ID must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'varchar', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "externalSubscriptionId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: false, relationId: true }),
    (0, typeorm_1.RelationId)((subscription) => subscription.plugin),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => plugin_entity_1.Plugin, (plugin) => plugin.subscriptions, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: false
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "plugin", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin Tenant ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin Tenant ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin Tenant ID must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: false, relationId: true }),
    (0, typeorm_1.RelationId)((subscription) => subscription.pluginTenant),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => plugin_tenant_entity_1.PluginTenant, (pluginTenant) => pluginTenant.subscriptions, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: false
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "pluginTenant", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscription plan ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Plan ID must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    (0, typeorm_1.RelationId)((subscription) => subscription.plan),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "planId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => plugin_subscription_plan_entity_1.PluginSubscriptionPlan, (plan) => plan.subscriptions, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: false
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "plan", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Subscriber user ID for user-specific subscriptions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Subscriber ID must be a valid UUID' }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== null),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    (0, typeorm_1.RelationId)((subscription) => subscription.subscriber),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "subscriberId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.User, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: false
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "subscriber", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Parent subscription ID for hierarchical subscriptions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Parent subscription ID must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    (0, typeorm_1.RelationId)((subscription) => subscription.parent),
    tslib_1.__metadata("design:type", String)
], PluginSubscription.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => PluginSubscription,
        description: 'Parent subscription (for subscriptions created through assignment)'
    }),
    (0, typeorm_1.TreeParent)(),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => [PluginSubscription],
        description: 'Child subscriptions (user subscriptions created through assignment)'
    }),
    (0, typeorm_1.TreeChildren)({ cascade: true }),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "children", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Plugin billings for this subscription' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_billing_entity_1.PluginBilling, (billing) => billing.subscription, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], PluginSubscription.prototype, "billings", void 0);
exports.PluginSubscription = PluginSubscription = PluginSubscription_1 = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('plugin_subscriptions'),
    (0, typeorm_1.Tree)('closure-table'),
    (0, typeorm_1.Index)(['pluginId', 'tenantId', 'organizationId'], { unique: false }),
    (0, typeorm_1.Index)(['subscriberId', 'tenantId'], { unique: false }),
    (0, typeorm_1.Index)(['status', 'endDate'], { unique: false }),
    (0, typeorm_1.Index)(['status', 'tenantId'], { unique: false }),
    (0, typeorm_1.Index)(['pluginId', 'subscriberId', 'tenantId'], {
        unique: true,
        where: '"subscriberId" IS NOT NULL'
    }),
    (0, typeorm_1.Index)(['planId'], { unique: false }),
    (0, typeorm_1.Index)(['externalSubscriptionId'], { unique: false }),
    (0, typeorm_1.Index)(['parentId'], { unique: false }),
    (0, typeorm_1.Index)(['scope', 'tenantId'], { unique: false })
], PluginSubscription);
//# sourceMappingURL=plugin-subscription.entity.js.map