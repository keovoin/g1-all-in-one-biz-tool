import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class TimesheetRecalculateCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Timesheet] Recalculate";
    constructor(id: ID);
}
