import { ICommand } from '@nestjs/cqrs';
export declare class TimeSlotBulkDeleteCommand implements ICommand {
    readonly input: any;
    readonly forceDelete: boolean;
    readonly entireSlots: boolean;
    static readonly type = "[TimeSlot] delete";
    constructor(input: any, forceDelete?: boolean, // Force delete
    entireSlots?: boolean);
}
