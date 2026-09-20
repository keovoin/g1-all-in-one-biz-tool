import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class ScheduleTimeLogEntriesCommand implements ICommand {
    readonly employeeId?: ID;
    readonly organizationId?: ID;
    readonly tenantId?: ID;
    static readonly type = "Adjust [TimeLog] Entries";
    constructor(employeeId?: ID, organizationId?: ID, tenantId?: ID);
}
