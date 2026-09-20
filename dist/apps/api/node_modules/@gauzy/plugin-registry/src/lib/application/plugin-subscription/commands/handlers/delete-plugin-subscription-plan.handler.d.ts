import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { DeletePluginSubscriptionPlanCommand } from '../delete-plugin-subscription-plan.command';
export declare class DeletePluginSubscriptionPlanCommandHandler implements ICommandHandler<DeletePluginSubscriptionPlanCommand> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(command: DeletePluginSubscriptionPlanCommand): Promise<void>;
}
