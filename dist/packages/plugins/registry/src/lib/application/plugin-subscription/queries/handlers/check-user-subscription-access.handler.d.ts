import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionAccessService } from '../../../../domain';
import { PluginSubscriptionAccessResponseDTO } from '../../../../shared';
import { CheckUserSubscriptionAccessQuery } from '../check-user-subscription-access.query';
export declare class CheckUserSubscriptionAccessQueryHandler implements IQueryHandler<CheckUserSubscriptionAccessQuery> {
    private readonly subscriptionAccessService;
    constructor(subscriptionAccessService: PluginSubscriptionAccessService);
    /**
     * Execute user-specific subscription access check query
     * Validates if a specific user has access to the plugin
     */
    execute(query: CheckUserSubscriptionAccessQuery): Promise<PluginSubscriptionAccessResponseDTO>;
}
