import { Repository } from 'typeorm';
import { PayrollRun } from '../payroll-run.entity';
export declare class TypeOrmPayrollRunRepository extends Repository<PayrollRun> {
    readonly repository: Repository<PayrollRun>;
    constructor(repository: Repository<PayrollRun>);
}
