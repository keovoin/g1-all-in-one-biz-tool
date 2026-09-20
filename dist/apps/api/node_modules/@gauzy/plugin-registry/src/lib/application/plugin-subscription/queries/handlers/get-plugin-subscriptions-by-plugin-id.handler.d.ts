import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { GetPluginSubscriptionsByPluginIdQuery } from '../get-plugin-subscriptions-by-plugin-id.query';
export declare class GetPluginSubscriptionsByPluginIdQueryHandler implements IQueryHandler<GetPluginSubscriptionsByPluginIdQuery> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    execute(query: GetPluginSubscriptionsByPluginIdQuery): Promise<IPagination<IPluginSubscription>>;
}
