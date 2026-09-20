import { IEvent } from '@nestjs/cqrs';
import { IActivityLogInput } from '@gauzy/contracts';
export declare class ActivityLogEvent implements IEvent {
    readonly input: IActivityLogInput;
    constructor(input: IActivityLogInput);
}
