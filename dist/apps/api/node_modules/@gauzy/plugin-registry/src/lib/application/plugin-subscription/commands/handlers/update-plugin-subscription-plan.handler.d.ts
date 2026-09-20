import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { UpdatePluginSubscriptionPlanCommand } from '../update-plugin-subscription-plan.command';
export declare class UpdatePluginSubscriptionPlanCommandHandler implements ICommandHandler<UpdatePluginSubscriptionPlanCommand> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(command: UpdatePluginSubscriptionPlanCommand): Promise<IPluginSubscriptionPlan>;
}
