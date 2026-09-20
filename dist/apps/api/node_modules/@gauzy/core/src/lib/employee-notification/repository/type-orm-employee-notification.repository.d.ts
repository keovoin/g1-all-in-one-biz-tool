import { Repository } from 'typeorm';
import { EmployeeNotification } from '../employee-notification.entity';
export declare class TypeOrmEmployeeNotificationRepository extends Repository<EmployeeNotification> {
    readonly repository: Repository<EmployeeNotification>;
    constructor(repository: Repository<EmployeeNotification>);
}
