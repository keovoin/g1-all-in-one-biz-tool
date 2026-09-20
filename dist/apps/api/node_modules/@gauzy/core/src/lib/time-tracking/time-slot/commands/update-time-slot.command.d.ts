import { ICommand } from '@nestjs/cqrs';
import { ID, ITimeSlot } from '@gauzy/contracts';
export declare class UpdateTimeSlotCommand implements ICommand {
    readonly id: ID;
    readonly input: ITimeSlot;
    static readonly type = "[TimeSlot] update";
    constructor(id: ID, input: ITimeSlot);
}
