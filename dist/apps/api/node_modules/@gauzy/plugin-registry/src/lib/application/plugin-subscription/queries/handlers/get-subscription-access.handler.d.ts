import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionAccessService } from '../../../../domain';
import { PluginSubscriptionAccessResponseDTO } from '../../../../shared';
import { GetSubscriptionAccessQuery } from '../get-subscription-access.query';
export declare class GetSubscriptionAccessQueryHandler implements IQueryHandler<GetSubscriptionAccessQuery> {
    private readonly subscriptionAccessService;
    constructor(subscriptionAccessService: PluginSubscriptionAccessService);
    /**
     * Execute subscription access check query
     * Returns detailed access information including permission to assign
     */
    execute(query: GetSubscriptionAccessQuery): Promise<PluginSubscriptionAccessResponseDTO>;
}
