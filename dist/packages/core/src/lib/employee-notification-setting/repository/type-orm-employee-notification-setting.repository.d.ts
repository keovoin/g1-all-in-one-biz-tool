import { Repository } from 'typeorm';
import { EmployeeNotificationSetting } from '../employee-notification-setting.entity';
export declare class TypeOrmEmployeeNotificationSettingRepository extends Repository<EmployeeNotificationSetting> {
    readonly repository: Repository<EmployeeNotificationSetting>;
    constructor(repository: Repository<EmployeeNotificationSetting>);
}
