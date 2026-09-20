import { DataSource } from 'typeorm';
import { EmployeeAward } from './employee-award.entity';
import { IEmployee, ITenant } from '@gauzy/contracts';
export declare const createDefaultEmployeeAwards: (dataSource: DataSource, tenant: ITenant, employee: IEmployee) => Promise<EmployeeAward[]>;
