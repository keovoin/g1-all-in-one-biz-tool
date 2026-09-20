import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { DowngradePluginSubscriptionCommand } from '../downgrade-plugin-subscription.command';
export declare class DowngradePluginSubscriptionCommandHandler implements ICommandHandler<DowngradePluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    private readonly logger;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
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
    execute(command: DowngradePluginSubscriptionCommand): Promise<IPluginSubscription>;
    /**
     * Downgrades all active child subscriptions when a parent subscription is downgraded.
     *
     * @param subscription - The parent subscription being downgraded
     * @returns Array of downgraded child subscriptions
     */
    private downgradeChildSubscriptions;
}
