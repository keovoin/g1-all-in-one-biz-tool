import { IPayrollRunCreateInput, PayrollFrequencyEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
/**
 * Create Payroll Run request DTO.
 *
 * `status` and the totals are intentionally not accepted: the status only moves through the
 * workflow endpoints and the totals are derived from the run's items.
 */
export declare class CreatePayrollRunDTO extends TenantOrganizationBaseDTO implements IPayrollRunCreateInput {
    readonly periodStart: Date;
    readonly periodEnd: Date;
    readonly payDate: Date;
    readonly frequency: PayrollFrequencyEnum;
    readonly currency: string;
    readonly notes?: string;
}
