"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasePluginSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const entities_1 = require("../../../../domain/entities");
const delete_plugin_subscription_command_1 = require("../delete-plugin-subscription.command");
const purchase_plugin_subscription_command_1 = require("../purchase-plugin-subscription.command");
let PurchasePluginSubscriptionCommandHandler = class PurchasePluginSubscriptionCommandHandler {
    constructor(pluginSubscriptionService, pluginTenantService, pluginSubscriptionPlanService, commandBus) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.pluginTenantService = pluginTenantService;
        this.pluginSubscriptionPlanService = pluginSubscriptionPlanService;
        this.commandBus = commandBus;
    }
    /**
     * Execute plugin subscription purchase with proper handling for free vs paid plans.
     *
     * Business Rules:
     * 1. Free Plans: Automatically create USER-scoped subscriptions with immediate ACTIVE status
     * 2. Paid Plans: Create subscriptions at the requested scope (TENANT/ORGANIZATION/USER) with PENDING status until payment
     * 3. Trial Plans: Create subscriptions with TRIAL status and set trial end date
     *
     * @param command - The purchase command with subscription details
     * @returns The created subscription
     */
    async execute(command) {
        const { purchaseDto, tenantId, organizationId, userId } = command;
        // Validate required parameters
        if (!purchaseDto.pluginId) {
            throw new common_1.BadRequestException('Plugin ID is required');
        }
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID is required');
        }
        if (!organizationId) {
            throw new common_1.BadRequestException('Organization ID is required for ORGANIZATION scope subscription');
        }
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required for USER scope subscription');
        }
        // Check for existing subscription based on scope
        const options = {
            pluginId: purchaseDto.pluginId
        };
        options.subscriberId = userId;
        options.organizationId = organizationId;
        options.tenantId = tenantId;
        const { record: existingSubscription, success: isSubscriptionExists } = await this.pluginSubscriptionService.findOneOrFailByWhereOptions(options);
        if (isSubscriptionExists && existingSubscription) {
            // If user has an active or trial subscription, reject the purchase
            if ([
                contracts_1.PluginSubscriptionStatus.ACTIVE,
                contracts_1.PluginSubscriptionStatus.TRIAL,
                contracts_1.PluginSubscriptionStatus.PENDING
            ].includes(existingSubscription.status)) {
                throw new common_1.BadRequestException('You already have an active subscription for this plugin. Please use upgrade or downgrade to change your plan.');
            }
            console.log(`[PurchaseSubscription] Deleting ${existingSubscription.status} subscription ${existingSubscription.id} to replace with new purchase`);
            // Delete the old subscription to avoid unique constraint violation
            await this.commandBus.execute(new delete_plugin_subscription_command_1.DeletePluginSubscriptionCommand(existingSubscription.id, existingSubscription.pluginTenantId));
        }
        const pluginTenantInput = {
            pluginId: purchaseDto.pluginId,
            tenantId,
            organizationId,
            scope: purchaseDto.scope
        };
        let subscription;
        // Handle subscription based on plan type
        if (purchaseDto.planId) {
            // Plan-based subscription
            const { record: plan, success: isPlanExists } = await this.pluginSubscriptionPlanService.findOneOrFailByIdString(purchaseDto.planId);
            if (!isPlanExists) {
                throw new common_1.BadRequestException(`Plugin subscription plan with ID "${purchaseDto.planId}" not found`);
            }
            // Ensure plugin tenant relationship exists
            const pluginTenantId = await this.pluginTenantService.findOrCreate({
                ...pluginTenantInput,
                ...(plan.hasLimitations && {
                    maxActiveUsers: plan.limitations?.['maxUsers'] || 1,
                    maxInstallations: plan.limitations?.['maxProjects'] || 1
                })
            });
            if (plan.isFree) {
                // Free plan - create immediate active subscription
                subscription = entities_1.PluginSubscription.createFreeSubscription(purchaseDto.pluginId, pluginTenantId, tenantId, userId, organizationId);
                subscription.planId = purchaseDto.planId;
                subscription.scope = purchaseDto.scope; // Use requested scope
            }
            else if (plan.hasTrial) {
                // Trial plan - create trial subscription
                subscription = entities_1.PluginSubscription.createTrialSubscription(purchaseDto.pluginId, pluginTenantId, tenantId, purchaseDto.planId, plan.trialDays || 7, // Default to 7 days if not specified
                purchaseDto.scope, userId, organizationId);
            }
            else {
                // Paid plan - create pending subscription
                const endDate = this.calculateSubscriptionEndDate(plan.billingPeriod);
                subscription = entities_1.PluginSubscription.createPaidSubscription(purchaseDto.pluginId, pluginTenantId, tenantId, purchaseDto.planId, purchaseDto.scope, endDate, userId, organizationId, purchaseDto.paymentMethod);
            }
        }
        else {
            // Get or create plugin tenant relationship
            const pluginTenantId = await this.pluginTenantService.findOrCreate(pluginTenantInput);
            // No plan specified - create free subscription
            subscription = entities_1.PluginSubscription.createFreeSubscription(purchaseDto.pluginId, pluginTenantId, tenantId, userId, organizationId);
            // Ensure scope is set correctly for free subscription if not USER
            if (purchaseDto.scope !== contracts_1.PluginScope.USER) {
                subscription.scope = contracts_1.PluginScope.USER;
            }
        }
        // Set additional properties from purchase DTO
        subscription.autoRenew = purchaseDto.autoRenew;
        // Merge metadata
        if (purchaseDto.metadata) {
            subscription.metadata = {
                ...subscription.metadata,
                ...purchaseDto.metadata
            };
        }
        // Add purchase metadata
        if (purchaseDto.promoCode) {
            subscription.metadata = {
                ...subscription.metadata,
                promoCode: purchaseDto.promoCode
            };
        }
        // Save the subscription
        return this.pluginSubscriptionService.save(subscription);
    }
    /**
     * Calculate subscription end date based on billing period
     * @param billingPeriod - The billing period
     * @returns The end date for the subscription
     */
    calculateSubscriptionEndDate(billingPeriod) {
        const endDate = new Date();
        switch (billingPeriod) {
            case contracts_1.PluginBillingPeriod.DAILY:
                endDate.setDate(endDate.getDate() + 1);
                break;
            case contracts_1.PluginBillingPeriod.WEEKLY:
                endDate.setDate(endDate.getDate() + 7);
                break;
            case contracts_1.PluginBillingPeriod.MONTHLY:
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case contracts_1.PluginBillingPeriod.QUARTERLY:
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case contracts_1.PluginBillingPeriod.YEARLY:
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
            case contracts_1.PluginBillingPeriod.ONE_TIME:
                // For one-time payments, set end date far in the future
                endDate.setFullYear(endDate.getFullYear() + 99);
                break;
            default:
                // Default to monthly for usage-based and unknown billing periods
                endDate.setMonth(endDate.getMonth() + 1);
                break;
        }
        return endDate;
    }
};
exports.PurchasePluginSubscriptionCommandHandler = PurchasePluginSubscriptionCommandHandler;
exports.PurchasePluginSubscriptionCommandHandler = PurchasePluginSubscriptionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(purchase_plugin_subscription_command_1.PurchasePluginSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService,
        domain_1.PluginTenantService,
        domain_1.PluginSubscriptionPlanService,
        cqrs_1.CommandBus])
], PurchasePluginSubscriptionCommandHandler);
//# sourceMappingURL=purchase-plugin-subscription.handler.js.map