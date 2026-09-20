import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { TimeLog } from './../time-log.entity';
export declare class TimeLogUpdateCommand implements ICommand {
    readonly input: Partial<TimeLog>;
    readonly id: ID | TimeLog;
    readonly manualTimeSlot?: boolean | null;
    readonly forceDelete: boolean;
    static readonly type = "[Time Tracking] Time Log update";
    constructor(input: Partial<TimeLog>, id: ID | TimeLog, manualTimeSlot?: boolean | null, forceDelete?: boolean);
}
