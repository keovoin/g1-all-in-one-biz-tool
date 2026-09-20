import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscription, PluginSubscriptionService } from '../../../../domain';
import { GetPluginSubscriptionsQuery } from '../get-plugin-subscriptions.query';
export declare class GetPluginSubscriptionsQueryHandler implements IQueryHandler<GetPluginSubscriptionsQuery> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    execute(query: GetPluginSubscriptionsQuery): Promise<IPagination<PluginSubscription>>;
}
