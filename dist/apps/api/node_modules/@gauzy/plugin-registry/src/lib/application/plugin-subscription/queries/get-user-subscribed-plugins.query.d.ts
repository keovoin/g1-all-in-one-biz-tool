import { ID, PluginSubscriptionStatus } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
/**
 * Query options for retrieving user's subscribed plugins
 */
export interface GetUserSubscribedPluginsOptions {
    /** Filter by subscription status */
    status?: Array<PluginSubscriptionStatus>;
    /** Number of items to skip for pagination */
    skip?: number;
    /** Number of items to take for pagination */
    take?: number;
    /** Relations to include in plugin results */
    relations?: string[];
}
/**
 * Query to retrieve all plugins where a user has an active subscription
 */
export declare class GetUserSubscribedPluginsQuery implements IQuery {
    readonly userId: ID;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    readonly options?: GetUserSubscribedPluginsOptions;
    static readonly type = "[Plugin] Get User Subscribed Plugins";
    constructor(userId: ID, tenantId: ID, organizationId?: ID, options?: GetUserSubscribedPluginsOptions);
}
