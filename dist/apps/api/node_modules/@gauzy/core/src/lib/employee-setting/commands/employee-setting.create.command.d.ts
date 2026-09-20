import { ICommand } from '@nestjs/cqrs';
import { IEmployeeSettingCreateInput } from '@gauzy/contracts';
export declare class EmployeeSettingCreateCommand implements ICommand {
    readonly input: IEmployeeSettingCreateInput;
    static readonly type = "[EmployeeSetting] Create";
    constructor(input: IEmployeeSettingCreateInput);
}
