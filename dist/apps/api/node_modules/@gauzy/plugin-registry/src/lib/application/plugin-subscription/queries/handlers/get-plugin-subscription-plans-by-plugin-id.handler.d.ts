import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { GetPluginSubscriptionPlansByPluginIdQuery } from '../get-plugin-subscription-plans-by-plugin-id.query';
export declare class GetPluginSubscriptionPlansByPluginIdQueryHandler implements IQueryHandler<GetPluginSubscriptionPlansByPluginIdQuery> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(query: GetPluginSubscriptionPlansByPluginIdQuery): Promise<IPluginSubscriptionPlan[]>;
}
