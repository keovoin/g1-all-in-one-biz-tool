import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { GetPluginSubscriptionByIdQuery } from '../get-plugin-subscription-by-id.query';
export declare class GetPluginSubscriptionByIdQueryHandler implements IQueryHandler<GetPluginSubscriptionByIdQuery> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    execute(query: GetPluginSubscriptionByIdQuery): Promise<IPluginSubscription>;
}
