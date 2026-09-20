import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { CopyPluginPlanCommand } from '../copy-plugin-plan.command';
export declare class CopyPluginPlanCommandHandler implements ICommandHandler<CopyPluginPlanCommand> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(command: CopyPluginPlanCommand): Promise<IPluginSubscriptionPlan>;
}
