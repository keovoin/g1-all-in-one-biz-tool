import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IEmployeeNotificationSetting } from '@gauzy/contracts';
import { EmployeeNotificationSettingService } from '../../employee-notification-setting.service';
import { EmployeeNotificationSettingUpdateCommand } from '../employee-notification-setting.update.command';
export declare class EmployeeNotificationSettingUpdateHandler implements ICommandHandler<EmployeeNotificationSettingUpdateCommand> {
    private readonly employeeNotificationSettingService;
    constructor(employeeNotificationSettingService: EmployeeNotificationSettingService);
    /**
     * Handles the EmployeeNotificationSettingUpdateCommand to Update an employee notification setting.
     *
     * @param command - The command containing the input data for employee notification setting update.
     * @returns A promise that resolves to the updated employee notification setting.
     */
    execute(command: EmployeeNotificationSettingUpdateCommand): Promise<IEmployeeNotificationSetting | UpdateResult>;
}
