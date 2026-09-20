import { ICommand } from '@nestjs/cqrs';
import { ID, IEmployeeNotificationSettingUpdateInput } from '@gauzy/contracts';
export declare class EmployeeNotificationSettingUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IEmployeeNotificationSettingUpdateInput;
    static readonly type = "[EmployeeNotificationSetting] Update";
    constructor(id: ID, input: IEmployeeNotificationSettingUpdateInput);
}
