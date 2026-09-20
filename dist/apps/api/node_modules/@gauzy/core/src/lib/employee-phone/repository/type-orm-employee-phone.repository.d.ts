import { Repository } from 'typeorm';
import { EmployeePhone } from '../employee-phone.entity';
export declare class TypeOrmEmployeePhoneRepository extends Repository<EmployeePhone> {
    readonly repository: Repository<EmployeePhone>;
    constructor(repository: Repository<EmployeePhone>);
}
