import { ICommand } from '@nestjs/cqrs';
import { ID, IEmployeeSettingUpdateInput } from '@gauzy/contracts';
export declare class EmployeeSettingUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IEmployeeSettingUpdateInput;
    static readonly type = "[EmployeeSetting] Update";
    constructor(id: ID, input: IEmployeeSettingUpdateInput);
}
