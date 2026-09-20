import { ICommandHandler } from '@nestjs/cqrs';
import { IScreeningTask } from '@gauzy/contracts';
import { ScreeningTasksService } from '../../screening-tasks.service';
import { ScreeningTaskUpdateCommand } from '../screening-task.update.command';
export declare class ScreeningTaskUpdateHandler implements ICommandHandler<ScreeningTaskUpdateCommand> {
    private readonly screeningTasksService;
    constructor(screeningTasksService: ScreeningTasksService);
    /**
     * Executes the update command for a screening task.
     *
     * @param command - Contains the screening task ID and update input.
     * @returns The updated screening task.
     */
    execute(command: ScreeningTaskUpdateCommand): Promise<IScreeningTask>;
}
