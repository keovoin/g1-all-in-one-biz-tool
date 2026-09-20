import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationSprint } from '@gauzy/contracts';
import { OrganizationSprintService } from '../../organization-sprint.service';
import { OrganizationSprintUpdateCommand } from '../organization-sprint.update.command';
export declare class OrganizationSprintUpdateHandler implements ICommandHandler<OrganizationSprintUpdateCommand> {
    private readonly organizationSprintService;
    constructor(organizationSprintService: OrganizationSprintService);
    execute(command: OrganizationSprintUpdateCommand): Promise<IOrganizationSprint>;
}
