import { IEmployee, IEmployeePhone } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmployeePhone extends TenantOrganizationBaseEntity implements IEmployeePhone {
    type: string;
    phoneNumber: string;
    employee?: IEmployee;
    employeeId?: IEmployee['id'];
}
