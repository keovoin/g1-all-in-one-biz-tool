import { ICommandHandler } from '@nestjs/cqrs';
import { OrganizationProjectService } from '../../organization-project.service';
import { OrganizationProjectEditByEmployeeCommand } from '../organization-project-edit-by-employee.command';
export declare class OrganizationProjectEditByEmployeeHandler implements ICommandHandler<OrganizationProjectEditByEmployeeCommand> {
    readonly organizationProjectService: OrganizationProjectService;
    constructor(organizationProjectService: OrganizationProjectService);
    /**
     * Executes the organization project edit command by an employee.
     *
     * @param command - The command containing the input for editing the organization project.
     * @returns A promise that resolves with the result of the command execution.
     */
    execute(command: OrganizationProjectEditByEmployeeCommand): Promise<any>;
}
