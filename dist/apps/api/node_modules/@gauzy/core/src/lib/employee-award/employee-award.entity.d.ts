import { IEmployee, IEmployeeAward } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmployeeAward extends TenantOrganizationBaseEntity implements IEmployeeAward {
    name: string;
    year: string;
    employee?: IEmployee;
    employeeId?: string;
}
