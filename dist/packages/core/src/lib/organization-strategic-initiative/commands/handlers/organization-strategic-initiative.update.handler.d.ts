import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiative } from '@gauzy/contracts';
import { UpdateResult } from 'typeorm';
import { OrganizationStrategicInitiativeUpdateCommand } from '../organization-strategic-initiative.update.command';
import { OrganizationStrategicInitiativeService } from '../../organization-strategic-initiative.service';
export declare class OrganizationStrategicInitiativeUpdateHandler implements ICommandHandler<OrganizationStrategicInitiativeUpdateCommand> {
    private readonly _organizationStrategicInitiativeService;
    constructor(_organizationStrategicInitiativeService: OrganizationStrategicInitiativeService);
    /**
     * Executes the update command for an organization strategic initiative.
     *
     * @param command - The update command containing the ID and input data.
     * @returns The updated organization strategic initiative or update result.
     */
    execute(command: OrganizationStrategicInitiativeUpdateCommand): Promise<IOrganizationStrategicInitiative | UpdateResult>;
}
