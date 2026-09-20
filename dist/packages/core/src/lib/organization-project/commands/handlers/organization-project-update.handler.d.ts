import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationProject } from '@gauzy/contracts';
import { OrganizationProjectUpdateCommand } from '../organization-project-update.command';
import { OrganizationProjectService } from '../../organization-project.service';
export declare class OrganizationProjectUpdateHandler implements ICommandHandler<OrganizationProjectUpdateCommand> {
    private readonly _organizationProjectService;
    constructor(_organizationProjectService: OrganizationProjectService);
    /**
     * Executes the update of an organization project using the provided command data.
     *
     * @param {OrganizationProjectUpdateCommand} command - The command containing the input data for updating the organization project.
     * @returns {Promise<IOrganizationProject>} - Returns a promise that resolves with the updated organization project.
     *
     * @throws {BadRequestException} - Throws a BadRequestException if an error occurs during the update process.
     */
    execute(command: OrganizationProjectUpdateCommand): Promise<IOrganizationProject>;
}
