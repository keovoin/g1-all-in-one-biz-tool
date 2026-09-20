import { ICommand } from '@nestjs/cqrs';
import { ITimeLog } from '@gauzy/contracts';
export declare class GetTimeLogGroupByClientCommand implements ICommand {
    readonly timeLogs: ITimeLog[];
    readonly timeZone: string;
    static readonly type = "[TimeLog] group by client";
    constructor(timeLogs: ITimeLog[], timeZone: string);
}
