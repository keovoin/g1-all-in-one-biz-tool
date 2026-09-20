import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { GetPluginSubscriptionsBySubscriberIdQuery } from '../get-plugin-subscriptions-by-subscriber-id.query';
export declare class GetPluginSubscriptionsBySubscriberIdQueryHandler implements IQueryHandler<GetPluginSubscriptionsBySubscriberIdQuery> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    execute(query: GetPluginSubscriptionsBySubscriberIdQuery): Promise<IPagination<IPluginSubscription>>;
}
