import { ID, IPayrollItem, IPayrollRun, IUser, PayrollFrequencyEnum, PayrollRunStatusEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
/**
 * One payroll run — a single pay period for an organization (issue #2453).
 *
 * The three totals are derived from the run's items and are recomputed by the server when the run
 * is processed. They are stored rather than computed on read so a paid run keeps the numbers it
 * was actually paid with, even if an item is later corrected.
 */
export declare class PayrollRun extends TenantOrganizationBaseEntity implements IPayrollRun {
    periodStart: Date;
    periodEnd: Date;
    payDate: Date;
    frequency: PayrollFrequencyEnum;
    status: PayrollRunStatusEnum;
    /** ISO 4217 currency code. */
    currency: string;
    totalGross: number;
    totalDeductions: number;
    totalNet: number;
    notes?: string;
    /** When the run was approved. */
    approvedAt?: Date;
    /** When the run was marked paid. */
    paidAt?: Date;
    /**
     * Who approved the run. Payroll is money leaving the company, so the sign-off is recorded
     * separately from the base entity's generic `updatedByUserId`.
     */
    approvedBy?: IUser;
    approvedByUserId?: ID;
    /**
     * Earnings and deductions that make up this run.
     */
    items?: IPayrollItem[];
}
