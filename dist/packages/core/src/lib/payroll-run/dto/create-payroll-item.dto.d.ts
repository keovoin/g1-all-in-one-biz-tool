import { ID, IPayrollItemCreateInput, PayrollItemCategoryEnum, PayrollItemTypeEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
/**
 * Add one earning or deduction line to a payroll run.
 *
 * `payrollRunId` is not part of the body — it comes from the route, so a caller cannot post an
 * item into somebody else's run by naming it here.
 */
export declare class CreatePayrollItemDTO extends TenantOrganizationBaseDTO implements IPayrollItemCreateInput {
    readonly employeeId: ID;
    readonly type: PayrollItemTypeEnum;
    readonly category: PayrollItemCategoryEnum;
    readonly description?: string;
    readonly amount: number;
    readonly quantity?: number;
    readonly unitPrice?: number;
    readonly taxable?: boolean;
}
