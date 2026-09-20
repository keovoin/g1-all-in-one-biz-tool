import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionService } from '../../../../domain';
import { IPluginSubscription } from '../../../../shared';
import { GetActivePluginSubscriptionQuery } from '../get-active-plugin-subscription.query';
export declare class GetActivePluginSubscriptionQueryHandler implements IQueryHandler<GetActivePluginSubscriptionQuery> {
    private readonly pluginSubscriptionService;
    /**
     * Active subscription statuses that qualify as "active"
     */
    private readonly ACTIVE_STATUSES;
    constructor(pluginSubscriptionService: PluginSubscriptionService);
    /**
     * Executes the query to retrieve an active plugin subscription
     * @param query - Query containing plugin, tenant, organization, and subscriber information
     * @returns The active subscription or null if not found/expired
     */
    execute(query: GetActivePluginSubscriptionQuery): Promise<IPluginSubscription | null>;
    /**
     * Builds the where conditions for the subscription query
     */
    private buildWhereConditions;
    /**
     * Fetches the most recent subscription matching the criteria
     */
    private findSubscription;
    /**
     * Validates that the subscription exists and is not expired
     */
    private validateSubscription;
}
