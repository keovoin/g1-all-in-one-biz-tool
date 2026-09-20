import { ID, IEmployee, IPayrollItem, IPayrollRun, PayrollItemCategoryEnum, PayrollItemTypeEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
/**
 * One earning or deduction line within a payroll run (issue #2453).
 *
 * `amount` is always positive; `category` decides whether it adds to or subtracts from net pay.
 * Money is `numeric(14,2)` with a numeric transformer — a bare `decimal` column comes back from
 * PostgreSQL as a string, and a float column silently loses cents.
 */
export declare class PayrollItem extends TenantOrganizationBaseEntity implements IPayrollItem {
    type: PayrollItemTypeEnum;
    category: PayrollItemCategoryEnum;
    description?: string;
    amount: number;
    quantity?: number;
    unitPrice?: number;
    taxable: boolean;
    /**
     * Run this line belongs to.
     */
    payrollRun?: IPayrollRun;
    payrollRunId: ID;
    /**
     * Employee the line is paid to. Nullable so a paid run keeps its history if the employee
     * record is later removed.
     */
    employee?: IEmployee;
    employeeId?: ID;
}
