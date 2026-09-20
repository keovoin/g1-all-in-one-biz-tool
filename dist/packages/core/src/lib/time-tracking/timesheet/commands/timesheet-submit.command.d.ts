import { ICommand } from '@nestjs/cqrs';
import { ISubmitTimesheetInput } from '@gauzy/contracts';
export declare class TimesheetSubmitCommand implements ICommand {
    readonly input: ISubmitTimesheetInput;
    static readonly type = "[Timesheet] Submit";
    constructor(input: ISubmitTimesheetInput);
}
