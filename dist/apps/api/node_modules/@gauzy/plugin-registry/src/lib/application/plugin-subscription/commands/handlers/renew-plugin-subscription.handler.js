"use strict";
var RenewPluginSubscriptionCommandHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewPluginSubscriptionCommandHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const domain_1 = require("../../../../domain");
const renew_plugin_subscription_command_1 = require("../renew-plugin-subscription.command");
let RenewPluginSubscriptionCommandHandler = RenewPluginSubscriptionCommandHandler_1 = class RenewPluginSubscriptionCommandHandler {
    constructor(pluginSubscriptionService) {
        this.pluginSubscriptionService = pluginSubscriptionService;
        this.logger = new common_1.Logger(RenewPluginSubscriptionCommandHandler_1.name);
    }
    /**
     * Execute plugin subscription renewal command.
     *
     * Business Rules:
     * 1. Subscription must exist and be accessible by the requesting user
     * 2. Subscription must be in ACTIVE or EXPIRED status to be renewed
     * 3. Subscription must have autoRenew enabled
     * 4. Renewal extends subscription by calculating the next billing period
     * 5. Updates subscription's status to ACTIVE and sets new endDate
     * 6. Records renewal metadata for tracking purposes
     * 7. Parent subscription renewal cascades to all active child subscriptions
     * 8. Child subscription renewal does NOT affect parent or sibling subscriptions
     *
     * @param command - The renewal command with subscription ID
     * @returns The renewed subscription with updated end date
     * @throws NotFoundException if subscription doesn't exist
     * @throws BadRequestException if renewal conditions are not met
     */
    async execute(command) {
        const { id } = command;
        // Get current tenant and organization context
        const tenantId = core_1.RequestContext.currentTenantId();
        const organizationId = core_1.RequestContext.currentOrganizationId();
        const subscriberId = core_1.RequestContext.currentUserId();
        try {
            // Find the existing subscription with proper tenant/organization filtering
            const subscription = await this.pluginSubscriptionService.findOneByIdString(id, {
                where: {
                    tenantId,
                    ...(organizationId && { organizationId }),
                    ...(subscriberId && { subscriberId })
                },
                relations: ['plan', 'plugin', 'pluginTenant', 'children', 'parent']
            });
            if (!subscription) {
                throw new common_1.NotFoundException(`Plugin subscription with ID ${id} not found or access denied`);
            }
            // Validate that the subscription can be renewed using domain method
            if (!subscription.canBeRenewed()) {
                throw new common_1.BadRequestException('This subscription cannot be renewed. Either auto-renewal is disabled, ' +
                    'subscription status is invalid, or it does not meet renewal criteria.');
            }
            // Calculate new end date based on the subscription plan's billing period
            let newEndDate;
            const billingPeriod = subscription.plan?.billingPeriod || 'monthly';
            try {
                newEndDate = subscription.calculateNextBillingDate(billingPeriod);
            }
            catch (error) {
                // Fallback to monthly renewal if billing period calculation fails
                const currentEndDate = subscription.endDate || new Date();
                newEndDate = new Date(currentEndDate);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
            }
            // Use domain method to renew subscription (includes validation and business logic)
            const renewedSubscription = subscription.renew(newEndDate);
            // Cascade renewal to child subscriptions if this is a parent subscription
            const renewedChildren = this.renewChildSubscriptions(renewedSubscription, newEndDate);
            if (renewedChildren.length > 0) {
                this.logger.log(`Renewed ${renewedChildren.length} child subscription(s) for parent subscription ${id}`);
            }
            // Add renewal metadata
            renewedSubscription.metadata = {
                ...renewedSubscription.metadata,
                renewedChildCount: renewedChildren.length,
                renewedBy: subscriberId,
                renewalType: renewedSubscription.isInherited() ? 'child' : 'parent'
            };
            // Persist the renewed subscription
            return this.pluginSubscriptionService.save(renewedSubscription);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to renew subscription: ${error.message}`);
        }
    }
    /**
     * Renews all active child subscriptions when a parent subscription is renewed.
     *
     * @param subscription - The parent subscription being renewed
     * @param newEndDate - The new end date to apply to children
     * @returns Array of renewed child subscriptions
     */
    renewChildSubscriptions(subscription, newEndDate) {
        // Skip if this is a child subscription (no cascade needed)
        if (subscription.isInherited())
            return [];
        return subscription.children.map((child) => child.renew(newEndDate));
    }
};
exports.RenewPluginSubscriptionCommandHandler = RenewPluginSubscriptionCommandHandler;
exports.RenewPluginSubscriptionCommandHandler = RenewPluginSubscriptionCommandHandler = RenewPluginSubscriptionCommandHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(renew_plugin_subscription_command_1.RenewPluginSubscriptionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSubscriptionService])
], RenewPluginSubscriptionCommandHandler);
//# sourceMappingURL=renew-plugin-subscription.handler.js.map