import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { IPluginSubscriptionPlan } from '../../../../shared';
import { BulkCreatePluginPlansCommand } from '../bulk-create-plugin-plans.command';
export declare class BulkCreatePluginPlansHandler implements ICommandHandler<BulkCreatePluginPlansCommand> {
    private readonly commandBus;
    private readonly dataSource;
    constructor(commandBus: CommandBus, dataSource: DataSource);
    /**
     * Executes the bulk create plugin plans command
     *
     * @param command - The command containing multiple plans creation data
     * @returns Array of created plugin subscription plans
     * @throws BadRequestException if validation fails
     */
    execute(command: BulkCreatePluginPlansCommand): Promise<IPluginSubscriptionPlan[]>;
}
