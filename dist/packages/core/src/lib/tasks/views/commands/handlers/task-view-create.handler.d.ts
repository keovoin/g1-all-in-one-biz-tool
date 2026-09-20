import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskView } from '@gauzy/contracts';
import { TaskViewService } from '../../view.service';
import { TaskViewCreateCommand } from '../task-view-create.command';
export declare class TaskViewCreateHandler implements ICommandHandler<TaskViewCreateCommand> {
    private readonly taskViewService;
    constructor(taskViewService: TaskViewService);
    execute(command: TaskViewCreateCommand): Promise<ITaskView>;
}
