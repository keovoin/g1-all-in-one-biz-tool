import { ICommand } from '@nestjs/cqrs';
import { IDeleteTimeSlot } from '@gauzy/contracts';
export declare class DeleteTimeSlotCommand implements ICommand {
    readonly options: IDeleteTimeSlot;
    static readonly type = "[TimeSlot] delete";
    constructor(options: IDeleteTimeSlot);
}
