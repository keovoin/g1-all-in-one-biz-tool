import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationProject } from '@gauzy/contracts';
import { OrganizationProjectCreateCommand } from '../organization-project-create.command';
import { OrganizationProjectService } from '../../organization-project.service';
export declare class OrganizationProjectCreateHandler implements ICommandHandler<OrganizationProjectCreateCommand> {
    private readonly _commandBus;
    private readonly _organizationProjectService;
    constructor(_commandBus: CommandBus, _organizationProjectService: OrganizationProjectService);
    /**
     * Executes the creation of an organization project along with its associated task statuses,
     * task priorities, task sizes, and issue types.
     *
     * @param {OrganizationProjectCreateCommand} command - The command containing the input data for creating the organization project.
     * @returns {Promise<IOrganizationProject>} - Returns a promise that resolves with the created organization project.
     *
     * @throws {BadRequestException} - Throws a BadRequestException if an error occurs during the process.
     */
    execute(command: OrganizationProjectCreateCommand): Promise<IOrganizationProject>;
    /**
     * Creates associated entities (task statuses, priorities, sizes, and issue types) for the organization project.
     *
     * @param {IOrganizationProject} project - The organization project for which associated entities will be created.
     * @returns {Promise<void>} - Returns a promise indicating the completion of the associated entities creation.
     *
     * @throws {HttpException} - Throws an HttpException if an error occurs during the process.
     */
    private createAssociatedEntitiesForProject;
}
