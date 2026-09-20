import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { GetExpiringSubscriptionsQuery } from '../get-expiring-subscriptions.query';
export declare class GetExpiringSubscriptionsQueryHandler implements IQueryHandler<GetExpiringSubscriptionsQuery> {
    private readonly pluginSubscriptionService;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    execute(query: GetExpiringSubscriptionsQuery): Promise<IPluginSubscription[]>;
}
