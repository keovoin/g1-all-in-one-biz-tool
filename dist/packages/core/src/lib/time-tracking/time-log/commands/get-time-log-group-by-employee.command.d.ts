import { ICommand } from '@nestjs/cqrs';
import { ITimeLog } from '@gauzy/contracts';
export declare class GetTimeLogGroupByEmployeeCommand implements ICommand {
    readonly timeLogs: ITimeLog[];
    readonly timeZone: string;
    static readonly type = "[TimeLog] group by employee";
    constructor(timeLogs: ITimeLog[], timeZone: string);
}
