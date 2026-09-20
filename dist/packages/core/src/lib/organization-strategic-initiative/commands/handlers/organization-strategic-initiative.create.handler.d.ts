import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiative } from '@gauzy/contracts';
import { OrganizationStrategicInitiativeCreateCommand } from '../organization-strategic-initiative.create.command';
import { OrganizationStrategicInitiativeService } from '../../organization-strategic-initiative.service';
export declare class OrganizationStrategicInitiativeCreateHandler implements ICommandHandler<OrganizationStrategicInitiativeCreateCommand> {
    private readonly _organizationStrategicInitiativeService;
    constructor(_organizationStrategicInitiativeService: OrganizationStrategicInitiativeService);
    /**
     * Executes the create command for an organization strategic initiative.
     *
     * @param command - The create command containing the input data.
     * @returns The created organization strategic initiative.
     */
    execute(command: OrganizationStrategicInitiativeCreateCommand): Promise<IOrganizationStrategicInitiative>;
}
