import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSubscriptionPlanService } from '../../../../domain';
import { BulkPluginPlanOperationCommand } from '../bulk-plugin-plan-operation.command';
export declare class BulkPluginPlanOperationCommandHandler implements ICommandHandler<BulkPluginPlanOperationCommand> {
    private readonly pluginSubscriptionPlanService;
    constructor(pluginSubscriptionPlanService: PluginSubscriptionPlanService);
    execute(command: BulkPluginPlanOperationCommand): Promise<void>;
}
