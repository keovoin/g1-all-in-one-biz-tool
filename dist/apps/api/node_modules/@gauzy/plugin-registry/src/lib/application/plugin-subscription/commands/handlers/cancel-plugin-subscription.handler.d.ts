import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { CancelPluginSubscriptionCommand } from '../cancel-plugin-subscription.command';
export declare class CancelPluginSubscriptionCommandHandler implements ICommandHandler<CancelPluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    private readonly logger;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
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
    execute(command: CancelPluginSubscriptionCommand): Promise<IPluginSubscription>;
    /**
     * Cancels all active child subscriptions when a parent subscription is cancelled.
     *
     * @param subscription - The parent subscription being cancelled
     * @param reason - The cancellation reason to propagate to children
     * @returns Array of cancelled child subscriptions
     */
    private cancelChildSubscriptions;
}
