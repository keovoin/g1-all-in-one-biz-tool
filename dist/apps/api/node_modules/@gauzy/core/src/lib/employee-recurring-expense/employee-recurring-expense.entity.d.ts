import { ID, IEmployee, IEmployeeRecurringExpense } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class EmployeeRecurringExpense extends TenantOrganizationBaseEntity implements IEmployeeRecurringExpense {
    startDay: number;
    startMonth: number;
    startYear: number;
    startDate: Date;
    endDay?: number;
    endMonth?: number;
    endYear?: number;
    endDate?: Date;
    categoryName: string;
    value: number;
    currency: string;
    parentRecurringExpenseId?: ID;
    employee?: IEmployee;
    employeeId?: ID;
}
