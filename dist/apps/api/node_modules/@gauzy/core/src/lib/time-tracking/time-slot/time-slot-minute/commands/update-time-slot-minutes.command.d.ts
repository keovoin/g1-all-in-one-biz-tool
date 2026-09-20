import { ICommand } from '@nestjs/cqrs';
import { ID, ITimeSlotMinute } from '@gauzy/contracts';
export declare class UpdateTimeSlotMinutesCommand implements ICommand {
    readonly id: ID;
    readonly input: ITimeSlotMinute;
    static readonly type = "[TimeSlotMinutes] update";
    constructor(id: ID, input: ITimeSlotMinute);
}
