import { ICommand } from '@nestjs/cqrs';
import { ID, IEmployeeUpdateInput } from '@gauzy/contracts';
export declare class EmployeeUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IEmployeeUpdateInput;
    static readonly type = "[Employee] Update";
    constructor(id: ID, input: IEmployeeUpdateInput);
}
