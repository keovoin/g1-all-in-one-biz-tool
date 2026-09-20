import { ICommandHandler } from '@nestjs/cqrs';
import { IEmployeeNotificationSetting } from '@gauzy/contracts';
import { EmployeeNotificationSettingService } from '../../employee-notification-setting.service';
import { EmployeeNotificationSettingCreateCommand } from '../employee-notification-setting.create.command';
export declare class EmployeeNotificationSettingCreateHandler implements ICommandHandler<EmployeeNotificationSettingCreateCommand> {
    private readonly employeeNotificationSettingService;
    constructor(employeeNotificationSettingService: EmployeeNotificationSettingService);
    /**
     * Handles the EmployeeNotificationSettingCreateCommand to create a new employee notification setting.
     *
     * @param command - The command containing the input data for employee notification setting creation.
     * @returns A promise that resolves to the created employee notification setting.
     */
    execute(command: EmployeeNotificationSettingCreateCommand): Promise<IEmployeeNotificationSetting>;
}
