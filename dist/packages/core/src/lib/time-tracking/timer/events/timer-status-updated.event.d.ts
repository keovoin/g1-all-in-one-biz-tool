import { IEvent } from '@nestjs/cqrs';
import { ITimerStatus } from '@gauzy/contracts';
export declare class TimerStatusUpdatedEvent implements IEvent {
    readonly status: ITimerStatus;
    constructor(status: ITimerStatus);
}
