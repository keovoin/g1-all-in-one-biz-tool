import { ICommandHandler } from '@nestjs/cqrs';
import { ID, ITask, ITaskUpdateInput } from '@gauzy/contracts';
import { EventBus } from '../../../event-bus/event-bus';
import { TaskService } from '../../task.service';
import { TaskUpdateCommand } from '../task-update.command';
export declare class TaskUpdateHandler implements ICommandHandler<TaskUpdateCommand> {
    private readonly _eventBus;
    private readonly _taskService;
    private readonly logger;
    constructor(_eventBus: EventBus, _taskService: TaskService);
    /**
     * Executes the TaskUpdateCommand.
     *
     * @param command - The command containing the task ID, update data, and a flag indicating whether to trigger an event.
     * @returns The updated task.
     */
    execute(command: TaskUpdateCommand): Promise<ITask>;
    /**
     * Update task, if already exist
     *
     * @param id - The ID of the task to update
     * @param input - The data to update the task with
     * @param triggeredEvent - Flag to indicate if an event should be triggered
     * @returns The updated task
     */
    update(id: ID, input: ITaskUpdateInput, triggeredEvent: boolean): Promise<ITask>;
}
