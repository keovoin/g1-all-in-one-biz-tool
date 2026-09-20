import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginService } from '../../../../domain';
import { IPlugin } from '../../../../shared';
import { GetUserSubscribedPluginsQuery } from '../get-user-subscribed-plugins.query';
export declare class GetUserSubscribedPluginsQueryHandler implements IQueryHandler<GetUserSubscribedPluginsQuery> {
    private readonly pluginService;
    constructor(pluginService: PluginService);
    /**
     * Execute the query to get all plugins where the user has a subscription
     * Uses database-level subquery for efficient pagination
     * Excludes plugins that already have a valid installation
     * @param query - The query containing userId, tenantId, organizationId and options
     * @returns Paginated list of plugins with active subscriptions (excluding installed ones)
     */
    execute(query: GetUserSubscribedPluginsQuery): Promise<IPagination<IPlugin>>;
}
