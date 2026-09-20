"use strict";
var PluginSubscriptionPlan_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSubscriptionPlanBuilder = exports.PluginSubscriptionPlan = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const plugin_subscription_entity_1 = require("./plugin-subscription.entity");
const plugin_entity_1 = require("./plugin.entity");
let PluginSubscriptionPlan = PluginSubscriptionPlan_1 = class PluginSubscriptionPlan extends core_1.BaseEntity {
    /*
     * Computed properties and helper methods
     */
    /**
     * Check if the plan is free
     */
    get isFree() {
        return this.type === contracts_1.PluginSubscriptionType.FREE || this.price === 0;
    }
    /**
     * Check if the plan offers a trial
     */
    get hasTrial() {
        return this.trialDays !== null && this.trialDays !== undefined && this.trialDays > 0;
    }
    /**
     * Get the effective price (with discount applied)
     */
    get effectivePrice() {
        if (!this.discountPercentage) {
            return this.price;
        }
        return this.price * (1 - this.discountPercentage / 100);
    }
    /**
     * Get discount amount
     */
    get discountAmount() {
        if (!this.discountPercentage) {
            return 0;
        }
        return this.price * (this.discountPercentage / 100);
    }
    /**
     * Get total price including setup fee
     */
    get totalPrice() {
        return this.effectivePrice + (this.setupFee || 0);
    }
    /**
     * Check if plan has any limitations
     */
    get hasLimitations() {
        return this.limitations && Object.keys(this.limitations).length > 0;
    }
    /**
     * Get formatted price string
     */
    getFormattedPrice() {
        return `${this.effectivePrice.toFixed(2)} ${this.currency}`;
    }
    /**
     * Get billing period display text
     */
    getBillingPeriodText() {
        const periodMap = {
            [contracts_1.PluginBillingPeriod.DAILY]: 'daily',
            [contracts_1.PluginBillingPeriod.WEEKLY]: 'weekly',
            [contracts_1.PluginBillingPeriod.MONTHLY]: 'monthly',
            [contracts_1.PluginBillingPeriod.QUARTERLY]: 'quarterly',
            [contracts_1.PluginBillingPeriod.YEARLY]: 'yearly',
            [contracts_1.PluginBillingPeriod.ONE_TIME]: 'one-time'
        };
        return periodMap[this.billingPeriod] || 'monthly';
    }
    /*
     * Static helper methods
     */
    /**
     * Create a new subscription plan instance
     */
    static create(plan) {
        // ---- 1. Validate required fields -----------------------------------------------------
        const name = plan.name?.trim();
        const pluginId = plan.pluginId?.trim();
        if (!name) {
            throw new Error('Plan name is required');
        }
        if (!pluginId) {
            throw new Error('Plugin ID is required');
        }
        // ---- 2. Normalize + resolve defaults -------------------------------------------------
        const normalized = {
            // Required
            name,
            pluginId,
            // Defaults
            type: plan.type ?? contracts_1.PluginSubscriptionType.FREE,
            price: plan.price ?? 0,
            currency: plan.currency ?? contracts_1.CurrenciesEnum.USD,
            billingPeriod: plan.billingPeriod ?? contracts_1.PluginBillingPeriod.MONTHLY,
            isActive: plan.isActive ?? true,
            isPopular: plan.isPopular ?? false,
            isRecommended: plan.isRecommended ?? false,
            sortOrder: this.getSortOrderByType(plan.type),
            // Optionals (preserve null/undefined as given)
            description: plan.description,
            features: plan.features ?? [],
            limitations: plan.limitations,
            trialDays: plan.trialDays,
            setupFee: plan.setupFee,
            discountPercentage: plan.discountPercentage,
            metadata: plan.metadata,
            createdById: plan.createdById
        };
        // ---- 3. Validate pricing rules -------------------------------------------------------
        if (!this.validatePricing(normalized.price, normalized.billingPeriod, normalized.setupFee)) {
            throw new Error('Invalid pricing configuration');
        }
        // ---- 4. Create the instance (single source of truth) ---------------------------------
        return Object.assign(new PluginSubscriptionPlan_1(), normalized);
    }
    /**
     * Create a free plan template
     */
    static createFreePlan(pluginId, features = [], name = 'Free') {
        return this.create({
            name,
            type: contracts_1.PluginSubscriptionType.FREE,
            price: 0,
            currency: contracts_1.CurrenciesEnum.USD,
            billingPeriod: contracts_1.PluginBillingPeriod.MONTHLY,
            features: features.length > 0 ? features : ['Basic features', 'Community support'],
            isActive: true,
            pluginId
        });
    }
    /**
     * Create a basic plan template
     */
    static createBasicPlan(pluginId, price, currency = contracts_1.CurrenciesEnum.USD, features = [], name = 'Basic') {
        return this.create({
            name,
            type: contracts_1.PluginSubscriptionType.BASIC,
            price,
            currency,
            billingPeriod: contracts_1.PluginBillingPeriod.MONTHLY,
            features: features.length > 0 ? features : ['Standard features', 'Email support', 'Basic integrations'],
            isActive: true,
            pluginId
        });
    }
    /**
     * Create a pro plan template
     */
    static createProPlan(pluginId, price, currency = contracts_1.CurrenciesEnum.USD, features = [], name = 'Pro') {
        return this.create({
            name,
            type: contracts_1.PluginSubscriptionType.PREMIUM,
            price,
            currency,
            billingPeriod: contracts_1.PluginBillingPeriod.MONTHLY,
            features: features.length > 0
                ? features
                : [
                    'All Basic features',
                    'Advanced features',
                    'Priority support',
                    'Advanced integrations',
                    'Custom workflows'
                ],
            isActive: true,
            isPopular: true,
            pluginId
        });
    }
    /**
     * Create an enterprise plan template
     */
    static createEnterprisePlan(pluginId, price, currency = contracts_1.CurrenciesEnum.USD, features = [], name = 'Enterprise') {
        return this.create({
            name,
            type: contracts_1.PluginSubscriptionType.ENTERPRISE,
            price,
            currency,
            billingPeriod: contracts_1.PluginBillingPeriod.YEARLY,
            features: features.length > 0
                ? features
                : [
                    'All Pro features',
                    'Unlimited usage',
                    'Dedicated support',
                    'Custom development',
                    'SLA guarantee',
                    'On-premise deployment'
                ],
            isActive: true,
            isRecommended: true,
            pluginId
        });
    }
    /**
     * Calculate monthly equivalent price for any billing period
     */
    static calculateMonthlyEquivalent(price, billingPeriod) {
        const daysInMonth = 30;
        const monthsInYear = 12;
        const monthsInQuarter = 3;
        const weeksInMonth = 4.33;
        switch (billingPeriod) {
            case contracts_1.PluginBillingPeriod.DAILY:
                return price * daysInMonth;
            case contracts_1.PluginBillingPeriod.WEEKLY:
                return price * weeksInMonth;
            case contracts_1.PluginBillingPeriod.MONTHLY:
                return price;
            case contracts_1.PluginBillingPeriod.QUARTERLY:
                return price / monthsInQuarter;
            case contracts_1.PluginBillingPeriod.YEARLY:
                return price / monthsInYear;
            case contracts_1.PluginBillingPeriod.ONE_TIME:
                return price; // One-time payments don't have a monthly equivalent
            default:
                return price;
        }
    }
    /**
     * Compare plans by effective monthly price
     */
    static comparePlans(plan1, plan2) {
        const monthly1 = this.calculateMonthlyEquivalent(plan1.price, plan1.billingPeriod);
        const monthly2 = this.calculateMonthlyEquivalent(plan2.price, plan2.billingPeriod);
        return monthly1 - monthly2;
    }
    /**
     * Sort plans by type order
     */
    static getSortOrderByType(type) {
        const typeOrder = {
            [contracts_1.PluginSubscriptionType.FREE]: 0,
            [contracts_1.PluginSubscriptionType.BASIC]: 1,
            [contracts_1.PluginSubscriptionType.PREMIUM]: 2,
            [contracts_1.PluginSubscriptionType.ENTERPRISE]: 3,
            [contracts_1.PluginSubscriptionType.CUSTOM]: 4
        };
        return typeOrder[type] ?? 0;
    }
    /**
     * Validate plan pricing
     */
    static validatePricing(price, billingPeriod, setupFee) {
        if (price < 0)
            return false;
        if (setupFee !== undefined && setupFee < 0)
            return false;
        // Additional business rules
        if (billingPeriod === contracts_1.PluginBillingPeriod.YEARLY && price < 1) {
            return false; // Yearly plans should have meaningful pricing
        }
        return true;
    }
    /**
     * Check if a plan offers better value than another (based on monthly equivalent)
     */
    static isBetterValue(plan1, plan2) {
        const monthly1 = this.calculateMonthlyEquivalent(plan1.price, plan1.billingPeriod);
        const monthly2 = this.calculateMonthlyEquivalent(plan2.price, plan2.billingPeriod);
        // Better value if same or higher tier at lower monthly cost
        const typeOrder = {
            [contracts_1.PluginSubscriptionType.FREE]: 0,
            [contracts_1.PluginSubscriptionType.BASIC]: 1,
            [contracts_1.PluginSubscriptionType.PREMIUM]: 2,
            [contracts_1.PluginSubscriptionType.ENTERPRISE]: 3,
            [contracts_1.PluginSubscriptionType.CUSTOM]: 4
        };
        return (typeOrder[plan1.type] ?? 0) >= (typeOrder[plan2.type] ?? 0) && monthly1 < monthly2;
    }
    /**
     * Calculate annual savings for yearly vs monthly billing
     */
    static calculateAnnualSavings(yearlyPlan, monthlyPlan) {
        if (yearlyPlan.billingPeriod !== contracts_1.PluginBillingPeriod.YEARLY) {
            throw new Error('First plan must be a yearly plan');
        }
        if (monthlyPlan.billingPeriod !== contracts_1.PluginBillingPeriod.MONTHLY) {
            throw new Error('Second plan must be a monthly plan');
        }
        const yearlyTotal = yearlyPlan.price;
        const monthlyAnnualTotal = monthlyPlan.price * 12;
        return monthlyAnnualTotal - yearlyTotal;
    }
    /**
     * Calculate savings percentage for yearly vs monthly
     */
    static calculateSavingsPercentage(yearlyPlan, monthlyPlan) {
        const savings = this.calculateAnnualSavings(yearlyPlan, monthlyPlan);
        const monthlyAnnualTotal = monthlyPlan.price * 12;
        return monthlyAnnualTotal > 0 ? (savings / monthlyAnnualTotal) * 100 : 0;
    }
    /**
     * Check if plan has a specific feature
     */
    static hasFeature(plan, feature) {
        return plan.features.some((f) => f.toLowerCase().includes(feature.toLowerCase()));
    }
    /**
     * Create a custom plan builder
     */
    static builder(pluginId) {
        return new PluginSubscriptionPlanBuilder(pluginId);
    }
};
exports.PluginSubscriptionPlan = PluginSubscriptionPlan;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plan name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plan name is required' }),
    (0, class_validator_1.IsString)({ message: 'Plan name must be a string' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlan.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plan description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlan.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginSubscriptionType, description: 'Subscription type/plan level' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginSubscriptionType, { message: 'Invalid subscription type' }),
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginSubscriptionType,
        default: contracts_1.PluginSubscriptionType.FREE
    }),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlan.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Plan price' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Price must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'Price cannot be negative' }),
    (0, core_1.MultiORMColumn)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], PluginSubscriptionPlan.prototype, "price", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Currency code (e.g., USD, EUR)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Currency is required' }),
    (0, class_validator_1.IsString)({ message: 'Currency must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 3, default: 'USD' }),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlan.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginBillingPeriod, description: 'Billing period' }),
    (0, class_validator_1.IsEnum)(contracts_1.PluginBillingPeriod, { message: 'Invalid billing period' }),
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginBillingPeriod,
        default: contracts_1.PluginBillingPeriod.MONTHLY
    }),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlan.prototype, "billingPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Plan features list' }),
    (0, class_validator_1.IsArray)({ message: 'Features must be an array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each feature must be a string' }),
    (0, core_1.MultiORMColumn)({ type: 'simple-array' }),
    tslib_1.__metadata("design:type", Array)
], PluginSubscriptionPlan.prototype, "features", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object, description: 'Plan limitations and quotas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Limitations must be an object' }),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], PluginSubscriptionPlan.prototype, "limitations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: 'Whether the plan is active and available for purchase' }),
    (0, class_validator_1.IsBoolean)({ message: 'isActive must be a boolean' }),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: true }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionPlan.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Whether this plan is marked as popular' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isPopular must be a boolean' }),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionPlan.prototype, "isPopular", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Boolean, description: 'Whether this plan is recommended' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isRecommended must be a boolean' }),
    (0, core_1.MultiORMColumn)({ type: 'boolean', default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSubscriptionPlan.prototype, "isRecommended", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Trial period duration in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Trial days must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Trial days cannot be negative' }),
    (0, core_1.MultiORMColumn)({ type: 'int', nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PluginSubscriptionPlan.prototype, "trialDays", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Setup fee for the plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Setup fee must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Setup fee cannot be negative' }),
    (0, core_1.MultiORMColumn)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PluginSubscriptionPlan.prototype, "setupFee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Discount percentage for the plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Discount percentage must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Discount percentage cannot be negative' }),
    (0, core_1.MultiORMColumn)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PluginSubscriptionPlan.prototype, "discountPercentage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Plan metadata (JSON string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Metadata must be an object' }),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], PluginSubscriptionPlan.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Number, description: 'Sort order for displaying plans' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Sort order must be a number' }),
    (0, core_1.MultiORMColumn)({ type: 'int', default: 0 }),
    tslib_1.__metadata("design:type", Number)
], PluginSubscriptionPlan.prototype, "sortOrder", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Plugin ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Plugin ID must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: false, relationId: true }),
    (0, typeorm_1.RelationId)((plan) => plan.plugin),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlan.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => plugin_entity_1.Plugin, (plugin) => plugin.subscriptionPlans, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: false
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSubscriptionPlan.prototype, "plugin", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'User who created this plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Created by ID must be a valid UUID' }),
    (0, core_1.MultiORMColumn)({ type: 'uuid', nullable: true, relationId: true }),
    (0, typeorm_1.RelationId)((plan) => plan.createdBy),
    tslib_1.__metadata("design:type", String)
], PluginSubscriptionPlan.prototype, "createdById", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.User, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: false
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSubscriptionPlan.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, description: 'Subscriptions using this plan' }),
    (0, core_1.MultiORMOneToMany)(() => plugin_subscription_entity_1.PluginSubscription, (subscription) => subscription.plan, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Object)
], PluginSubscriptionPlan.prototype, "subscriptions", void 0);
exports.PluginSubscriptionPlan = PluginSubscriptionPlan = PluginSubscriptionPlan_1 = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('plugin_subscription_plans'),
    (0, typeorm_1.Index)(['pluginId', 'type'], { unique: false }),
    (0, typeorm_1.Index)(['isActive', 'type'], { unique: false }),
    (0, typeorm_1.Index)(['price', 'billingPeriod'], { unique: false })
], PluginSubscriptionPlan);
/**
 * Builder class for creating subscription plans
 */
class PluginSubscriptionPlanBuilder {
    constructor(pluginId) {
        this.plan = {
            pluginId,
            type: contracts_1.PluginSubscriptionType.BASIC,
            price: 0,
            currency: contracts_1.CurrenciesEnum.USD,
            billingPeriod: contracts_1.PluginBillingPeriod.MONTHLY,
            features: [],
            isActive: true,
            isPopular: false,
            isRecommended: false,
            sortOrder: 0
        };
    }
    withName(name) {
        this.plan.name = name;
        return this;
    }
    withDescription(description) {
        this.plan.description = description;
        return this;
    }
    withType(type) {
        this.plan.type = type;
        return this;
    }
    withPrice(price) {
        this.plan.price = price;
        return this;
    }
    withCurrency(currency) {
        this.plan.currency = currency;
        return this;
    }
    withBillingPeriod(period) {
        this.plan.billingPeriod = period;
        return this;
    }
    withFeatures(features) {
        this.plan.features = features;
        return this;
    }
    addFeature(feature) {
        if (!this.plan.features) {
            this.plan.features = [];
        }
        this.plan.features.push(feature);
        return this;
    }
    withLimitations(limitations) {
        this.plan.limitations = limitations;
        return this;
    }
    withTrialDays(days) {
        this.plan.trialDays = days;
        return this;
    }
    withSetupFee(fee) {
        this.plan.setupFee = fee;
        return this;
    }
    withDiscount(percentage) {
        this.plan.discountPercentage = percentage;
        return this;
    }
    asPopular() {
        this.plan.isPopular = true;
        return this;
    }
    asRecommended() {
        this.plan.isRecommended = true;
        return this;
    }
    withSortOrder(order) {
        this.plan.sortOrder = order;
        return this;
    }
    withMetadata(metadata) {
        this.plan.metadata = metadata;
        return this;
    }
    setActive(active) {
        this.plan.isActive = active;
        return this;
    }
    build() {
        return PluginSubscriptionPlan.create(this.plan);
    }
}
exports.PluginSubscriptionPlanBuilder = PluginSubscriptionPlanBuilder;
//# sourceMappingURL=plugin-subscription-plan.entity.js.map