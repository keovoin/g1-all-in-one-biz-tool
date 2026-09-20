import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskVersion } from '@gauzy/contracts';
import { OrganizationProjectVersionBulkCreateCommand } from '../organization-project-version-bulk-create.command';
import { TaskVersionService } from '../../version.service';
import { TaskVersion } from '../../version.entity';
export declare class OrganizationProjectVersionBulkCreateHandler implements ICommandHandler<OrganizationProjectVersionBulkCreateCommand> {
    private readonly taskVersionService;
    constructor(taskVersionService: TaskVersionService);
    execute(command: OrganizationProjectVersionBulkCreateCommand): Promise<ITaskVersion[] & TaskVersion[]>;
}
