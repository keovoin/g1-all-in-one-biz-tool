import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class TimeSlotMergeCommand implements ICommand {
    readonly organizationId: ID;
    readonly employeeId: ID;
    readonly start: Date;
    readonly end: Date;
    readonly forceDelete: boolean;
    static readonly type = "[TimeSlot] merge";
    constructor(organizationId: ID, employeeId: ID, start: Date, end: Date, forceDelete?: boolean);
}
