import { ICommand } from '@nestjs/cqrs';
import { IEmployeeAvailabilityCreateInput } from '@gauzy/contracts';
export declare class EmployeeAvailabilityCreateCommand implements ICommand {
    readonly input: IEmployeeAvailabilityCreateInput;
    static readonly type = "[EmployeeAvailability] Create";
    constructor(input: IEmployeeAvailabilityCreateInput);
}
