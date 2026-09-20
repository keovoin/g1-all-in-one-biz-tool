"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendTrialSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const extend_trial_subscription_command_1 = require("../extend-trial-subscription.command");
let ExtendTrialSubscriptionCommandHandler = class ExtendTrialSubscriptionCommandHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
    }
    /**
     * Execute trial subscription extension command.
     *
     * Business Rules:
     * 1. Subscription must exist and be accessible by the requesting user
     * 2. Subscription must be in TRIAL status with an active trial period
     * 3. Extension adds the specified number of days to the current trial end date
     * 4. Updates subscription metadata to track extension details
     * 5. Sets updatedAt timestamp to current time
     *
     * @param command - The extend trial command with subscription ID and extension days
     * @returns The updated subscription with extended trial period
     * @throws NotFoundException if subscription doesn't exist or access is denied
     * @throws BadRequestException if trial extension conditions are not met
     */
    async execute(command) {
        const { subscriptionId, days, tenantId, organizationId, userId } = command;
        // Get current context for security filtering
        const currentTenantId = core_1.RequestContext.currentTenantId();
        const currentOrganizationId = core_1.RequestContext.currentOrganizationId();
        const currentUser = core_1.RequestContext.currentUser();
        // Use command parameters or fall back to current context
        const effectiveTenantId = tenantId || currentTenantId;
        const effectiveOrganizationId = organizationId || currentOrganizationId;
        const effectiveUserId = userId || currentUser?.id;
        // Find the subscription with proper tenant/organization filtering
        const subscription = await this.pluginSubscriptionService.findOneByIdString(subscriptionId, {
            where: {
                tenantId: effectiveTenantId,
                ...(effectiveOrganizationId && { organizationId: effectiveOrganizationId }),
                ...(effectiveUserId && { subscriberId: effectiveUserId })
            },
            relations: ['plan', 'plugin', 'pluginTenant']
        });
        if (!subscription) {
            throw new common_1.NotFoundException(`Plugin subscription with ID ${subscriptionId} not found or access denied`);
        }
        // Validate that the trial can be extended using domain method
        if (!subscription.canExtendTrial()) {
            throw new common_1.BadRequestException('Cannot extend trial: subscription is not in trial status or trial has already expired');
        }
        // Validate extension days
        if (!days || days <= 0) {
            throw new common_1.BadRequestException('Extension days must be a positive number');
        }
        // Use domain method to extend trial (includes validation and business logic)
        const extendedSubscription = subscription.extendTrial(days, effectiveUserId);
        // Cascade trial extension to child subscriptions if this is a parent subscription
        extendedSubscription.children = extendedSubscription.children.map((child) => child.extendTrial(days, effectiveUserId));
        // Update metadata with extension details
        extendedSubscription.metadata = {
            ...extendedSubscription.metadata,
            trialExtendedBy: effectiveUserId,
            trialExtensionDays: days,
            trialExtendedAt: new Date()
        };
        // Persist the updated subscription
        return this.pluginSubscriptionService.save(extendedSubscription);
    }
};
exports.ExtendTrialSubscriptionCommandHandler = ExtendTrialSubscriptionCommandHandler;
exports.ExtendTrialSubscriptionCommandHandler = ExtendTrialSubscriptionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(extend_trial_subscription_command_1.ExtendTrialSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], ExtendTrialSubscriptionCommandHandler);
//# sourceMappingURL=extend-trial-subscription.handler.js.map