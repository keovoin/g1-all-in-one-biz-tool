import { ID } from '@gauzy/contracts';
import { QueryBus } from '@nestjs/cqrs';
import { PluginSubscription } from '../../domain';
/**
 * Plugin Subscription Analytics Controller
 * Provides analytics and access verification for plugin subscriptions
 */
export declare class PluginSubscriptionAnalyticsController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    /**
     * Get expiring subscriptions analytics
     */
    getExpiringSubscriptions(days?: number): Promise<PluginSubscription[]>;
    /**
     * Verify plugin access for current user/tenant
     */
    verifyPluginAccess(pluginId: ID): Promise<{
        hasAccess: boolean;
        subscription?: PluginSubscription;
    }>;
}
