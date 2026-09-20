import { ICommand } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiativeCreateInput } from '@gauzy/contracts';
/**
 * Command to create a new organization strategic initiative.
 */
export declare class OrganizationStrategicInitiativeCreateCommand implements ICommand {
    readonly input: IOrganizationStrategicInitiativeCreateInput;
    static readonly type = "[OrganizationStrategicInitiative] Create";
    constructor(input: IOrganizationStrategicInitiativeCreateInput);
}
