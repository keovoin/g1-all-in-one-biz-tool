import { ICommandHandler } from '@nestjs/cqrs';
import { OrganizationDepartmentEditByEmployeeCommand } from '../organization-department.edit-by-employee.command';
import { OrganizationDepartmentService } from '../../organization-department.service';
import { UpdateEntityByMembersHandler } from '../../../shared/handlers';
export declare class OrganizationDepartmentEditByEmployeeHandler extends UpdateEntityByMembersHandler implements ICommandHandler<OrganizationDepartmentEditByEmployeeCommand> {
    readonly organizationDepartmentService: OrganizationDepartmentService;
    constructor(organizationDepartmentService: OrganizationDepartmentService);
    /**
     * Executes the organization department edit command by an employee.
     *
     * @param command - The command containing the input for editing the organization department.
     * @returns A promise that resolves with the result of the command execution.
     */
    execute(command: OrganizationDepartmentEditByEmployeeCommand): Promise<any>;
}
