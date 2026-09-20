import { ICommand } from '@nestjs/cqrs';
import { ID, IOrganizationStrategicSignals } from '@gauzy/contracts';
/**
 * Command to update strategic signals of an initiative.
 */
export declare class OrganizationStrategicInitiativeUpdateSignalsCommand implements ICommand {
    readonly id: ID;
    readonly signals: IOrganizationStrategicSignals;
    static readonly type = "[OrganizationStrategicInitiative] Update Signals";
    constructor(id: ID, signals: IOrganizationStrategicSignals);
}
