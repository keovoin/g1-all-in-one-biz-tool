import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationTeam } from '@gauzy/contracts';
import { OrganizationTeamCreateCommand } from '../organization-team.create.command';
import { OrganizationTeamService } from './../../organization-team.service';
export declare class OrganizationTeamCreateHandler implements ICommandHandler<OrganizationTeamCreateCommand> {
    private readonly _commandBus;
    private readonly _organizationTeamService;
    private readonly logger;
    constructor(_commandBus: CommandBus, _organizationTeamService: OrganizationTeamService);
    /**
     * Handles the creation of an organization team and initiates related background tasks.
     *
     * @param command - The command containing the input data for creating the team.
     * @returns The created organization team.
     */
    execute(command: OrganizationTeamCreateCommand): Promise<IOrganizationTeam>;
    /**
     * Executes related commands concurrently in the background.
     *
     * @param team - The organization team for which to execute the commands.
     */
    private executeBackgroundTasks;
}
