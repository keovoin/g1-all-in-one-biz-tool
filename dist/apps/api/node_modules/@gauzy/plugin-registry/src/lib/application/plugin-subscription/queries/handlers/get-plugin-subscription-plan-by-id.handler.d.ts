import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { GetPluginSubscriptionPlanByIdQuery } from '../get-plugin-subscription-plan-by-id.query';
export declare class GetPluginSubscriptionPlanByIdQueryHandler implements IQueryHandler<GetPluginSubscriptionPlanByIdQuery> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(query: GetPluginSubscriptionPlanByIdQuery): Promise<IPluginSubscriptionPlan>;
}
