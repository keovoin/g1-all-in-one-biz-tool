import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { GetPluginPlanAnalyticsQuery } from '../get-plugin-plan-analytics.query';
export declare class GetPluginPlanAnalyticsQueryHandler implements IQueryHandler<GetPluginPlanAnalyticsQuery> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(query: GetPluginPlanAnalyticsQuery): Promise<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        revenue: number;
        conversionRate: number;
    }>;
}
