import { IPagination, PluginSubscriptionStatus } from '@gauzy/contracts';
import { QueryBus } from '@nestjs/cqrs';
import { IPlugin } from '../../shared';
/**
 * User Subscribed Plugins Controller
 * Provides endpoint to retrieve all plugins where the current user has an active subscription
 */
export declare class UserSubscribedPluginsController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    /**
     * Get all plugins where the current user has an active subscription
     */
    getSubscribedPlugins(status?: PluginSubscriptionStatus[], skip?: number, take?: number, relations?: string[]): Promise<IPagination<IPlugin>>;
}
