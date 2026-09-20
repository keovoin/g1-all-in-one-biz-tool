"use strict";
var DowngradePluginSubscriptionCommandHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DowngradePluginSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const downgrade_plugin_subscription_command_1 = require("../downgrade-plugin-subscription.command");
let DowngradePluginSubscriptionCommandHandler = DowngradePluginSubscriptionCommandHandler_1 = class DowngradePluginSubscriptionCommandHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.logger = new common_1.Logger(DowngradePluginSubscriptionCommandHandler_1.name);
    }
    /**
     * Execute plugin subscription downgrade command.
     *
     * Business Rules:
     * 1. Subscription must exist and be accessible by the requesting user
     * 2. Subscription must be in ACTIVE status to be downgraded
     * 3. New plan must be different from current plan
     * 4. Downgrade sets metadata tracking previous plan and downgrade timestamp
     * 5. Updates subscription's planId and updatedAt timestamp
     * 6. Downgrade may trigger prorated refund calculations (handled in metadata)
     * 7. Parent subscription downgrade cascades plan change to all active child subscriptions
     * 8. Child subscription downgrade does NOT affect parent or sibling subscriptions
     *
     * @param command - The downgrade command with subscription and plan details
     * @returns The updated subscription with new plan
     * @throws NotFoundException if subscription doesn't exist
     * @throws BadRequestException if downgrade conditions are not met
     */
    async execute(command) {
        const { subscriptionId, newPlanId, tenantId, organizationId, userId } = command;
        // Find the existing subscription with proper tenant/organization filtering
        const subscription = await this.pluginSubscriptionService.findOneByIdString(subscriptionId, {
            where: {
                tenantId,
                ...(organizationId && { organizationId }),
                ...(userId && { subscriberId: userId })
            },
            relations: ['plan', 'plugin', 'children']
        });
        if (!subscription) {
            throw new common_1.NotFoundException(`Plugin subscription with ID ${subscriptionId} not found or access denied`);
        }
        // Ensure the user can only downgrade their own subscription
        if (userId && subscription.subscriberId && subscription.subscriberId !== userId) {
            throw new common_1.BadRequestException('You can only downgrade your own subscriptions');
        }
        // Validate that the new plan is different from current plan
        if (subscription.planId === newPlanId) {
            throw new common_1.BadRequestException('Cannot downgrade to the same plan. Please select a different plan.');
        }
        if (!subscription.canBeDowngraded()) {
            throw new common_1.BadRequestException('This subscription cannot be downgraded due to plan restrictions.');
        }
        // Use domain method to downgrade subscription (includes validation and business logic)
        const downgradedSubscription = subscription.downgradeToPlan(newPlanId);
        // Cascade downgrade to child subscriptions if this is a parent subscription
        const downgradedChildren = this.downgradeChildSubscriptions(downgradedSubscription);
        if (downgradedChildren.length > 0) {
            this.logger.log(`Downgraded ${downgradedChildren.length} child subscription(s) for parent subscription ${subscriptionId}`);
        }
        // Add downgrade metadata
        downgradedSubscription.metadata = {
            ...downgradedSubscription.metadata,
            downgradedChildCount: downgradedChildren.length,
            downgradedBy: userId,
            downgradeType: downgradedSubscription.isInherited() ? 'child' : 'parent'
        };
        // Persist the downgraded subscription
        return this.pluginSubscriptionService.save(downgradedSubscription);
    }
    /**
     * Downgrades all active child subscriptions when a parent subscription is downgraded.
     *
     * @param subscription - The parent subscription being downgraded
     * @returns Array of downgraded child subscriptions
     */
    downgradeChildSubscriptions(subscription) {
        // Skip if this is a child subscription (no cascade needed)
        if (subscription.isInherited()) {
            return [];
        }
        return subscription.children.map((child) => child.downgradeToPlan(subscription.planId));
    }
};
exports.DowngradePluginSubscriptionCommandHandler = DowngradePluginSubscriptionCommandHandler;
exports.DowngradePluginSubscriptionCommandHandler = DowngradePluginSubscriptionCommandHandler = DowngradePluginSubscriptionCommandHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(downgrade_plugin_subscription_command_1.DowngradePluginSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], DowngradePluginSubscriptionCommandHandler);
//# sourceMappingURL=downgrade-plugin-subscription.handler.js.map