import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskPriority } from '@gauzy/contracts';
import { OrganizationProjectTaskPriorityBulkCreateCommand } from '../organization-project-task-priority-bulk-create.command';
import { TaskPriorityService } from '../../priority.service';
export declare class OrganizationProjectTaskPriorityBulkCreateHandler implements ICommandHandler<OrganizationProjectTaskPriorityBulkCreateCommand> {
    private readonly taskPriorityService;
    constructor(taskPriorityService: TaskPriorityService);
    execute(command: OrganizationProjectTaskPriorityBulkCreateCommand): Promise<ITaskPriority[]>;
}
