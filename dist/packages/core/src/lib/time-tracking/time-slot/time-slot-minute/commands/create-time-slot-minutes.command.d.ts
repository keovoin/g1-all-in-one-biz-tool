import { ICommand } from '@nestjs/cqrs';
import { ITimeSlotMinute } from '@gauzy/contracts';
export declare class CreateTimeSlotMinutesCommand implements ICommand {
    readonly input: ITimeSlotMinute;
    static readonly type = "[TimeSlotMinutes] create";
    constructor(input: ITimeSlotMinute);
}
