import { IEvent } from '@nestjs/cqrs';
import { ITimeLog } from '@gauzy/contracts';
export declare class TimerStoppedEvent implements IEvent {
    readonly timeLog: ITimeLog;
    constructor(timeLog: ITimeLog);
}
