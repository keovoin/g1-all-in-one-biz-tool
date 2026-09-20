import { ICommand } from '@nestjs/cqrs';
import { IEmployeeNotificationSettingCreateInput } from '@gauzy/contracts';
export declare class EmployeeNotificationSettingCreateCommand implements ICommand {
    readonly input: IEmployeeNotificationSettingCreateInput;
    static readonly type = "[EmployeeNotificationSetting] Create";
    constructor(input: IEmployeeNotificationSettingCreateInput);
}
