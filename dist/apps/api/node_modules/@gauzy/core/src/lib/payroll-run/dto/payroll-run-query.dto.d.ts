import { ID, IPayrollRunFindInput, PayrollFrequencyEnum, PayrollRunStatusEnum } from '@gauzy/contracts';
/**
 * Query filters for listing payroll runs.
 */
export declare class PayrollRunQueryDTO implements IPayrollRunFindInput {
    /**
     * Required, and checked against the caller's own organizations. Payroll is per organization,
     * and leaving it optional would let one request list every organization of the tenant.
     */
    readonly organizationId: ID;
    readonly status?: PayrollRunStatusEnum;
    readonly frequency?: PayrollFrequencyEnum;
    readonly periodStart?: Date;
    readonly periodEnd?: Date;
    readonly page?: number;
    readonly limit?: number;
}
