import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { UpgradePluginSubscriptionCommand } from '../upgrade-plugin-subscription.command';
export declare class UpgradePluginSubscriptionCommandHandler implements ICommandHandler<UpgradePluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    private readonly logger;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    /**
     * Execute plugin subscription upgrade command.
     *
     * Business Rules:
     * 1. Subscription must exist and be accessible by the requesting user
     * 2. Subscription must be in ACTIVE status to be upgraded
     * 3. New plan must be different from current plan
     * 4. Upgrade sets metadata tracking previous plan and upgrade timestamp
     * 5. Updates subscription's planId and updatedAt timestamp
     * 6. Parent subscription upgrade cascades plan change to all active child subscriptions
     * 7. Child subscription upgrade does NOT affect parent or sibling subscriptions
     *
     * @param command - The upgrade command with subscription and plan details
     * @returns The updated subscription with new plan
     * @throws NotFoundException if subscription doesn't exist
     * @throws BadRequestException if upgrade conditions are not met
     */
    execute(command: UpgradePluginSubscriptionCommand): Promise<IPluginSubscription>;
    /**
     * Upgrades all active child subscriptions when a parent subscription is upgraded.
     *
     * @param subscription - The parent subscription being upgraded
     * @param newPlanId - The new plan ID to apply to children
     * @param previousPlanId - The previous plan ID for metadata tracking
     * @returns Array of upgraded child subscriptions
     */
    private upgradeChildSubscriptions;
}
