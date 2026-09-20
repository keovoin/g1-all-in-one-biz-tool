import { ICommand } from '@nestjs/cqrs';
import { IEmployeeAvailabilityCreateInput } from '@gauzy/contracts';
export declare class EmployeeAvailabilityBulkCreateCommand implements ICommand {
    readonly input: IEmployeeAvailabilityCreateInput[];
    static readonly type = "[Employee Availability] Bulk Create";
    constructor(input: IEmployeeAvailabilityCreateInput[]);
}
