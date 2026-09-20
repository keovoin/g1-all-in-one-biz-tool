import { ICommandHandler } from '@nestjs/cqrs';
import { IEmployeeSetting } from '@gauzy/contracts';
import { EmployeeSettingUpdateCommand } from '../employee-setting.update.command';
import { EmployeeSettingService } from '../../employee-setting.service';
export declare class EmployeeSettingUpdateHandler implements ICommandHandler<EmployeeSettingUpdateCommand> {
    private readonly employeeSettingService;
    constructor(employeeSettingService: EmployeeSettingService);
    execute(command: EmployeeSettingUpdateCommand): Promise<IEmployeeSetting>;
}
