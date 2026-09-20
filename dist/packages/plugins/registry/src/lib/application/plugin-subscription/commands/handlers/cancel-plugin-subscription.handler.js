"use strict";
var CancelPluginSubscriptionCommandHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelPluginSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const cancel_plugin_subscription_command_1 = require("../cancel-plugin-subscription.command");
let CancelPluginSubscriptionCommandHandler = CancelPluginSubscriptionCommandHandler_1 = class CancelPluginSubscriptionCommandHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.logger = new common_1.Logger(CancelPluginSubscriptionCommandHandler_1.name);
    }
    /**
     * Execute plugin subscription cancellation command.
     *
     * Business Rules:
     * 1. Subscription must exist and be accessible by the requesting user
     * 2. Subscription must not already be cancelled
     * 3. Cancellation sets status to CANCELLED and records cancellation timestamp and reason
     * 4. Sets autoRenew to false to prevent future renewals
     * 5. Updates subscription's updatedAt timestamp
     * 6. Parent subscription cancellation cascades to all active child subscriptions
     * 7. Child subscription cancellation does NOT affect parent or sibling subscriptions
     * 8. Cancellation may trigger prorated refund calculations (handled elsewhere)
     *
     * @param command - The cancellation command with subscription ID and optional reason
     * @returns The updated cancelled subscription
     * @throws NotFoundException if subscription doesn't exist
     * @throws BadRequestException if cancellation conditions are not met
     */
    async execute(command) {
        const { id, reason } = command;
        try {
            // Get current tenant and organization context
            const tenantId = core_1.RequestContext.currentTenantId();
            const organizationId = core_1.RequestContext.currentOrganizationId();
            const subscriberId = core_1.RequestContext.currentUserId();
            // Find the existing subscription with proper tenant/organization filtering
            const subscription = await this.pluginSubscriptionService.findOneByIdString(id, {
                where: {
                    tenantId,
                    status: (0, typeorm_1.Not)(contracts_1.PluginSubscriptionStatus.CANCELLED),
                    ...(organizationId && { organizationId }),
                    ...(subscriberId && { subscriberId })
                },
                relations: ['plan', 'plugin', 'pluginTenant', 'children', 'children.pluginTenant']
            });
            if (!subscription) {
                throw new common_1.NotFoundException(`Plugin subscription with ID ${id} not found or access denied`);
            }
            // Validate that the subscription can be cancelled using domain method
            if (!subscription.canBeCancelled()) {
                throw new common_1.BadRequestException('This subscription cannot be cancelled as it is already cancelled');
            }
            // Use domain method to cancel subscription (includes validation and business logic)
            const cancelledSubscription = subscription.cancel(reason);
            // Cascade cancellation to child subscriptions if this is a parent subscription
            const cancelledChildren = await this.cancelChildSubscriptions(cancelledSubscription, reason);
            if (cancelledChildren.length > 0) {
                this.logger.log(`Cancelled ${cancelledChildren.length} child subscription(s) for parent subscription ${id}`);
            }
            // Add cancellation metadata
            cancelledSubscription.metadata = {
                ...cancelledSubscription.metadata,
                cancelledChildCount: cancelledChildren.length,
                cancelledBy: subscriberId,
                cancellationType: subscription.isInherited() ? 'parent' : 'child'
            };
            return this.pluginSubscriptionService.save(cancelledSubscription);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to cancel subscription: ${error.message}`);
        }
    }
    /**
     * Cancels all active child subscriptions when a parent subscription is cancelled.
     *
     * @param subscription - The parent subscription being cancelled
     * @param reason - The cancellation reason to propagate to children
     * @returns Array of cancelled child subscriptions
     */
    async cancelChildSubscriptions(subscription, reason) {
        // Skip if this is a child subscription (no cascade needed)
        if (subscription.isInherited())
            return [];
        const cascadeReason = reason ? `Parent subscription cancelled: ${reason}` : 'Parent subscription cancelled';
        return subscription.children
            .filter((child) => child.canBeCancelled())
            .map((child) => child.cancel(cascadeReason));
    }
};
exports.CancelPluginSubscriptionCommandHandler = CancelPluginSubscriptionCommandHandler;
exports.CancelPluginSubscriptionCommandHandler = CancelPluginSubscriptionCommandHandler = CancelPluginSubscriptionCommandHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(cancel_plugin_subscription_command_1.CancelPluginSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], CancelPluginSubscriptionCommandHandler);
//# sourceMappingURL=cancel-plugin-subscription.handler.js.map