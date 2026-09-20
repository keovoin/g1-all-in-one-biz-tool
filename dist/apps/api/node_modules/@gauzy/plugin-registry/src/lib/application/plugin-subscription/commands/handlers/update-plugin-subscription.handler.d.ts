import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { UpdatePluginSubscriptionCommand } from '../update-plugin-subscription.command';
export declare class UpdatePluginSubscriptionCommandHandler implements ICommandHandler<UpdatePluginSubscriptionCommand> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    execute(command: UpdatePluginSubscriptionCommand): Promise<IPluginSubscription | UpdateResult>;
}
