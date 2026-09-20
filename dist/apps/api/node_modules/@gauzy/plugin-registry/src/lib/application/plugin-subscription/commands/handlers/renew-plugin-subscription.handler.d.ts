import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { RenewPluginSubscriptionCommand } from '../renew-plugin-subscription.command';
export declare class RenewPluginSubscriptionCommandHandler implements ICommandHandler<RenewPluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    private readonly logger;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
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
    execute(command: RenewPluginSubscriptionCommand): Promise<IPluginSubscription>;
    /**
     * Renews all active child subscriptions when a parent subscription is renewed.
     *
     * @param subscription - The parent subscription being renewed
     * @param newEndDate - The new end date to apply to children
     * @returns Array of renewed child subscriptions
     */
    private renewChildSubscriptions;
}
