import { IEmployee, ITimeOff as ITimeOffRequest, ITimeOffPolicy, LeaveAccrualFrequencyEnum, LeaveTypeEnum } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class TimeOffPolicy extends TenantOrganizationBaseEntity implements ITimeOffPolicy {
    name: string;
    requiresApproval: boolean;
    paid: boolean;
    /**
     * Leave category, used for grouping and reporting (issue #314).
     */
    leaveType?: LeaveTypeEnum;
    /**
     * Upper bound on the days an employee may take in a year under this policy.
     */
    maxDaysPerYear?: number;
    /**
     * Whether unused days roll over into the next year.
     */
    allowCarryForward?: boolean;
    /**
     * Upper bound on the days that may roll over. `0` or unset means no cap.
     */
    maxCarryForwardDays?: number;
    /**
     * Days accrued per accrual period.
     */
    accrualRate?: number;
    /**
     * How often `accrualRate` is granted.
     */
    accrualFrequency?: LeaveAccrualFrequencyEnum;
    /**
     * Whether this is the organization's default policy.
     */
    isDefault?: boolean;
    /**
     * TimeOffRequest
     */
    timeOffRequests?: ITimeOffRequest[];
    employees?: IEmployee[];
}
