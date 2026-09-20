import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskSize } from '@gauzy/contracts';
import { OrganizationProjectTaskSizeBulkCreateCommand } from '../organization-project-task-size-bulk-create.command';
import { TaskSizeService } from '../../size.service';
export declare class OrganizationTaskProjectSizeBulkCreateHandler implements ICommandHandler<OrganizationProjectTaskSizeBulkCreateCommand> {
    private readonly taskSizeService;
    constructor(taskSizeService: TaskSizeService);
    execute(command: OrganizationProjectTaskSizeBulkCreateCommand): Promise<ITaskSize[]>;
}
