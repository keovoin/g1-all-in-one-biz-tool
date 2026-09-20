import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class UpdateEmployeeTotalWorkedHoursCommand implements ICommand {
    readonly employeeId: ID;
    readonly hours?: number;
    static readonly type = "[Employee] Update Total Worked Hours";
    constructor(employeeId: ID, hours?: number);
}
