import { ICommand } from '@nestjs/cqrs';
import { IDateRange, ITimeSlot } from '@gauzy/contracts';
import { TimeLog } from '../time-log.entity';
export declare class DeleteTimeSpanCommand implements ICommand {
    readonly newTime: IDateRange;
    readonly timeLog: TimeLog;
    readonly timeSlot: ITimeSlot;
    readonly forceDelete: boolean;
    static readonly type = "[TimeLog] delete time span";
    constructor(newTime: IDateRange, timeLog: TimeLog, timeSlot: ITimeSlot, forceDelete?: boolean);
}
