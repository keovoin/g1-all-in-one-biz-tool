import { ICommandHandler } from '@nestjs/cqrs';
import { IEmployeeSetting } from '@gauzy/contracts';
import { EmployeeSettingCreateCommand } from '../employee-setting.create.command';
import { EmployeeSettingService } from '../../employee-setting.service';
export declare class EmployeeSettingCreateHandler implements ICommandHandler<EmployeeSettingCreateCommand> {
    private readonly employeeSettingService;
    constructor(employeeSettingService: EmployeeSettingService);
    execute(command: EmployeeSettingCreateCommand): Promise<IEmployeeSetting>;
}
