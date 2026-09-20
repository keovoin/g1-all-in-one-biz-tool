import { ICommandHandler } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiative } from '@gauzy/contracts';
import { OrganizationStrategicInitiativeUpdateSignalsCommand } from '../organization-strategic-initiative.update-signals.command';
import { OrganizationStrategicInitiativeService } from '../../organization-strategic-initiative.service';
export declare class OrganizationStrategicInitiativeUpdateSignalsHandler implements ICommandHandler<OrganizationStrategicInitiativeUpdateSignalsCommand> {
    private readonly _organizationStrategicInitiativeService;
    constructor(_organizationStrategicInitiativeService: OrganizationStrategicInitiativeService);
    /**
     * Executes the update signals command for an organization strategic initiative.
     *
     * @param command - The command containing the ID and signals data.
     * @returns The updated organization strategic initiative.
     */
    execute(command: OrganizationStrategicInitiativeUpdateSignalsCommand): Promise<IOrganizationStrategicInitiative>;
}
