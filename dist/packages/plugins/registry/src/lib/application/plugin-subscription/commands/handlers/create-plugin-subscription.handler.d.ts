import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { CreatePluginSubscriptionCommand } from '../create-plugin-subscription.command';
export declare class CreatePluginSubscriptionCommandHandler implements ICommandHandler<CreatePluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    execute(command: CreatePluginSubscriptionCommand): Promise<IPluginSubscription>;
}
