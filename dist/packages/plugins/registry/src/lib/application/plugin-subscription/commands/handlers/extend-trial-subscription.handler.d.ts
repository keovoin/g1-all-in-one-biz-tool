import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { ExtendTrialSubscriptionCommand } from '../extend-trial-subscription.command';
export declare class ExtendTrialSubscriptionCommandHandler implements ICommandHandler<ExtendTrialSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
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
    execute(command: ExtendTrialSubscriptionCommand): Promise<IPluginSubscription>;
}
