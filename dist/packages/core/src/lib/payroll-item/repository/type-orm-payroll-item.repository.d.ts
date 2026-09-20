import { Repository } from 'typeorm';
import { PayrollItem } from '../payroll-item.entity';
export declare class TypeOrmPayrollItemRepository extends Repository<PayrollItem> {
    readonly repository: Repository<PayrollItem>;
    constructor(repository: Repository<PayrollItem>);
}
