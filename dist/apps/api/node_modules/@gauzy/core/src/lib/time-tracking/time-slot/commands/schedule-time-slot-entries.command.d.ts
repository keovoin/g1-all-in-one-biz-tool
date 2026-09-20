import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class ScheduleTimeSlotEntriesCommand implements ICommand {
    readonly organizationId: ID;
    readonly tenantId: ID;
    static readonly type = "Adjust [TimeSlot] Entries";
    constructor(organizationId: ID, tenantId: ID);
}
