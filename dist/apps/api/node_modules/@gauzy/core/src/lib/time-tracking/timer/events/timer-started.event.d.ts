import { IEvent } from '@nestjs/cqrs';
import { ITimeLog } from '@gauzy/contracts';
export declare class TimerStartedEvent implements IEvent {
    readonly timeLog: ITimeLog;
    constructor(timeLog: ITimeLog);
}
