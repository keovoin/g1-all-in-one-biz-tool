import { ID, IEmployee, ITimeOffBalance, ITimeOffPolicy } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
/**
 * Leave balance of one employee, under one Time Off policy, for one year (issue #314).
 *
 * `(tenantId, organizationId, employeeId, policyId, year)` is UNIQUE. That is a correctness
 * control, not a hint: without it two concurrent "find or create" calls would each insert a row
 * and the employee would end up with two balances, so days deducted from one would still look
 * available on the other.
 *
 * `carriedOut` is what makes the ledger honest across a year boundary: once days are rolled into
 * the next year they stop counting as remaining in this one, instead of being available twice.
 *
 * The day counts are `numeric` with a numeric transformer, matching every other money/quantity
 * column in the codebase — a bare `decimal` column comes back from PostgreSQL as a string, and
 * `'5' + 1` is `'51'`.
 */
export declare class TimeOffBalance extends TenantOrganizationBaseEntity implements ITimeOffBalance {
    year: number;
    accrued: number;
    taken: number;
    carriedForward: number;
    carriedOut: number;
    remaining: number;
    /**
     * Employee the balance belongs to.
     */
    employee?: IEmployee;
    employeeId: ID;
    /**
     * Policy the balance is tracked against.
     */
    policy?: ITimeOffPolicy;
    policyId: ID;
}
