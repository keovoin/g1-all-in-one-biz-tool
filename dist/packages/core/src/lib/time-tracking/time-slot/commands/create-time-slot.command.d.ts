import { ICommand } from '@nestjs/cqrs';
import { ITimeSlot } from '@gauzy/contracts';
export declare class CreateTimeSlotCommand implements ICommand {
    readonly input: ITimeSlot;
    readonly forceDelete: boolean;
    static readonly type = "[TimeSlot] create";
    constructor(input: ITimeSlot, forceDelete?: boolean);
}
