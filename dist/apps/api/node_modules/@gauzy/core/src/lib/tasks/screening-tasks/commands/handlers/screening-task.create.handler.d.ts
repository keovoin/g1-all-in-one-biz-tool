import { ICommandHandler } from '@nestjs/cqrs';
import { IScreeningTask } from '@gauzy/contracts';
import { ScreeningTasksService } from '../../screening-tasks.service';
import { ScreeningTaskCreateCommand } from '../screening-task.create.command';
export declare class ScreeningTaskCreateHandler implements ICommandHandler<ScreeningTaskCreateCommand> {
    private readonly screeningTasksService;
    constructor(screeningTasksService: ScreeningTasksService);
    /**
     * Executes the create command for a screening task.
     *
     * @param command - The command containing the creation input for a screening task.
     * @returns A promise that resolves to the newly created screening task.
     */
    execute(command: ScreeningTaskCreateCommand): Promise<IScreeningTask>;
}
