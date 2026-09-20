import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class TimesheetFirstOrCreateCommand implements ICommand {
    readonly date: Date;
    readonly employeeId: ID;
    readonly organizationId?: ID;
    static readonly type = "[Timesheet] First Or Create";
    constructor(date: Date, employeeId: ID, organizationId?: ID);
}
