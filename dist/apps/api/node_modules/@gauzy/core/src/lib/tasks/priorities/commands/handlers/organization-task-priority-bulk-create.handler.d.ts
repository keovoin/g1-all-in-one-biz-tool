import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskPriority } from '@gauzy/contracts';
import { OrganizationTaskPriorityBulkCreateCommand } from '../organization-task-priority-bulk-create.command';
import { TaskPriorityService } from './../../priority.service';
export declare class OrganizationTaskPriorityBulkCreateHandler implements ICommandHandler<OrganizationTaskPriorityBulkCreateCommand> {
    private readonly taskPriorityService;
    constructor(taskPriorityService: TaskPriorityService);
    execute(command: OrganizationTaskPriorityBulkCreateCommand): Promise<ITaskPriority[]>;
}
