import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { ListPluginSubscriptionPlansQuery } from '../list-plugin-subscription-plans.query';
export declare class ListPluginSubscriptionPlansQueryHandler implements IQueryHandler<ListPluginSubscriptionPlansQuery> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(query: ListPluginSubscriptionPlansQuery): Promise<IPluginSubscriptionPlan[]>;
}
