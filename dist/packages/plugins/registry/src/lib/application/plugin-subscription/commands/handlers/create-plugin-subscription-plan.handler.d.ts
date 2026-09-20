import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { CreatePluginSubscriptionPlanCommand } from '../create-plugin-subscription-plan.command';
export declare class CreatePluginSubscriptionPlanCommandHandler implements ICommandHandler<CreatePluginSubscriptionPlanCommand> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(command: CreatePluginSubscriptionPlanCommand): Promise<IPluginSubscriptionPlan>;
}
