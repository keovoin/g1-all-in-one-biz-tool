import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationDepartment } from '@gauzy/contracts';
import { OrganizationDepartmentService } from '../../organization-department.service';
import { OrganizationDepartmentUpdateCommand } from '../organization-department.update.command';
export declare class OrganizationDepartmentUpdateHandler implements ICommandHandler<OrganizationDepartmentUpdateCommand> {
    private readonly organizationDepartmentService;
    constructor(organizationDepartmentService: OrganizationDepartmentService);
    /**
     *
     * @param command
     * @returns
     */
    execute(command: OrganizationDepartmentUpdateCommand): Promise<IOrganizationDepartment>;
}
