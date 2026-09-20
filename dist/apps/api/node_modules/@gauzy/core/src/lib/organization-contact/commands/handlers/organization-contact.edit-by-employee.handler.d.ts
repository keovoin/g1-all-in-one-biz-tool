import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateEntityByMembersHandler } from '../../../shared/handlers';
import { OrganizationContactService } from '../../organization-contact.service';
import { OrganizationContactEditByEmployeeCommand } from '../organization-contact.edit-by-employee.command';
export declare class OrganizationContactEditByEmployeeHandler extends UpdateEntityByMembersHandler implements ICommandHandler<OrganizationContactEditByEmployeeCommand> {
    readonly organizationContactService: OrganizationContactService;
    constructor(organizationContactService: OrganizationContactService);
    /**
     * Executes the organization contact edit command by an employee.
     *
     * @param command - The command containing the input for editing the organization contact.
     * @returns A promise that resolves with the result of the command execution.
     */
    execute(command: OrganizationContactEditByEmployeeCommand): Promise<any>;
}
