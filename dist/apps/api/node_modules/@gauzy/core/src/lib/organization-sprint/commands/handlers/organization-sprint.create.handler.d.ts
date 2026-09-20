import { ICommandHandler } from '@nestjs/cqrs';
import { OrganizationSprintCreateCommand } from '../organization-sprint.create.command';
import { OrganizationSprintService } from '../../organization-sprint.service';
import { IOrganizationSprint } from '@gauzy/contracts';
export declare class OrganizationSprintCreateHandler implements ICommandHandler<OrganizationSprintCreateCommand> {
    private readonly _organizationSprintService;
    constructor(_organizationSprintService: OrganizationSprintService);
    /**
     *  Executes the creation of an organization sprint
     * @param {OrganizationSprintCreateCommand} command The command containing the input data for creating the organization sprint.
     * @returns {Promise<IOrganizationSprint>} - Returns a promise that resolves with the created organization sprint.
     * @throws {BadRequestException} - Throws a BadRequestException if an error occurs during the creation process.
     * @memberof OrganizationSprintCreateHandler
     */
    execute(command: OrganizationSprintCreateCommand): Promise<IOrganizationSprint>;
}
