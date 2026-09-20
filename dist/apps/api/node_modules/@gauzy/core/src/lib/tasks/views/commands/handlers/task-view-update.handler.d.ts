import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskView } from '@gauzy/contracts';
import { TaskViewUpdateCommand } from '../task-view-update.command';
import { TaskViewService } from '../../view.service';
export declare class TaskViewUpdateHandler implements ICommandHandler<TaskViewUpdateCommand> {
    private readonly taskViewService;
    constructor(taskViewService: TaskViewService);
    execute(command: TaskViewUpdateCommand): Promise<ITaskView>;
}
