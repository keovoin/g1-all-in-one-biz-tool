import { IQueryHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { GetActivePluginPlansQuery } from '../get-active-plugin-plans.query';
export declare class GetActivePluginPlansQueryHandler implements IQueryHandler<GetActivePluginPlansQuery> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(query: GetActivePluginPlansQuery): Promise<IPluginSubscriptionPlan[]>;
}
