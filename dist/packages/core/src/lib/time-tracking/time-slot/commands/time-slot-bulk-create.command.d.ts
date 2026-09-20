import { ICommand } from '@nestjs/cqrs';
import { ID, ITimeSlot } from '@gauzy/contracts';
export declare class TimeSlotBulkCreateCommand implements ICommand {
    readonly slots: ITimeSlot[];
    readonly employeeId: ID;
    readonly organizationId: ID;
    readonly tenantId: ID;
    static readonly type = "[TimeSlot] bulk create";
    constructor(slots: ITimeSlot[], employeeId: ID, organizationId: ID, tenantId: ID);
}
