import { IEmployeeNotificationSettingCreateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../core/crud/tenant-aware-crud.service';
import { EmployeeNotificationSetting } from './employee-notification-setting.entity';
import { TypeOrmEmployeeNotificationSettingRepository } from './repository/type-orm-employee-notification-setting.repository';
import { MikroOrmEmployeeNotificationSettingRepository } from './repository/mikro-orm-employee-notification-setting.repository';
export declare class EmployeeNotificationSettingService extends TenantAwareCrudService<EmployeeNotificationSetting> {
    readonly typeOrmEmployeeNotificationSettingRepository: TypeOrmEmployeeNotificationSettingRepository;
    readonly mikroOrmEmployeeNotificationSettingRepository: MikroOrmEmployeeNotificationSettingRepository;
    constructor(typeOrmEmployeeNotificationSettingRepository: TypeOrmEmployeeNotificationSettingRepository, mikroOrmEmployeeNotificationSettingRepository: MikroOrmEmployeeNotificationSettingRepository);
    /**
     * Creates an employee notification setting record
     *
     * @param {IEmployeeNotificationSetting} input - The input data for creating a notification setting
     * @returns {Promise<EmployeeNotificationSetting>} The created notification setting
     */
    create(input: IEmployeeNotificationSettingCreateInput): Promise<EmployeeNotificationSetting>;
}
