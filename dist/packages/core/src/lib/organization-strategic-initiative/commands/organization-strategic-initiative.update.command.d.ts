import { ICommand } from '@nestjs/cqrs';
import { ID, IOrganizationStrategicInitiativeUpdateInput } from '@gauzy/contracts';
/**
 * Command to update an existing organization strategic initiative.
 */
export declare class OrganizationStrategicInitiativeUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IOrganizationStrategicInitiativeUpdateInput;
    static readonly type = "[OrganizationStrategicInitiative] Update";
    constructor(id: ID, input: IOrganizationStrategicInitiativeUpdateInput);
}
