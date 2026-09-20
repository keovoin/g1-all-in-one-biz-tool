import { IPagination, ITimeOffBalance, ITimeOffBalanceAdjustInput, ITimeOffBalanceAllocateInput, ITimeOffBalanceCarryForwardInput, ITimeOffBalanceFindInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { TimeOffBalance } from './time-off-balance.entity';
import { MikroOrmTimeOffBalanceRepository } from './repository/mikro-orm-time-off-balance.repository';
import { TypeOrmTimeOffBalanceRepository } from './repository/type-orm-time-off-balance.repository';
/**
 * Leave balances per employee, per policy, per year (issue #314).
 *
 * `deduct` and `reverse` are written as single conditional UPDATE statements rather than
 * read-modify-write pairs. Two approvals landing at the same moment on a read-modify-write would
 * each read the same `taken`, and one of the two deductions would silently vanish — an employee
 * could take more leave than they have. The UPDATE carries its own balance check in the WHERE
 * clause, so the database decides, and a zero row count means "not enough left".
 */
export declare class TimeOffBalanceService extends TenantAwareCrudService<TimeOffBalance> {
    readonly typeOrmTimeOffBalanceRepository: TypeOrmTimeOffBalanceRepository;
    readonly mikroOrmTimeOffBalanceRepository: MikroOrmTimeOffBalanceRepository;
    constructor(typeOrmTimeOffBalanceRepository: TypeOrmTimeOffBalanceRepository, mikroOrmTimeOffBalanceRepository: MikroOrmTimeOffBalanceRepository);
    /**
     * List balances, optionally narrowed by employee, policy and year.
     *
     * A caller without `CHANGE_SELECTED_EMPLOYEE` only ever sees their own balances, whatever
     * `employeeId` they ask for — leave entitlement is personal data, and every employee holds
     * `TIME_OFF_VIEW` by default.
     *
     * @param input the filters to apply
     * @returns the matching balances
     */
    findAllByFilter(input: ITimeOffBalanceFindInput & {
        page?: number;
        limit?: number;
    }): Promise<IPagination<ITimeOffBalance>>;
    /**
     * The current employee's own balances. Backs `GET /time-off-balance/me`, which the MCP
     * server's `get_my_time_off_balance` tool already calls.
     *
     * @param input the policy and year to filter by
     * @returns the caller's balances
     */
    findMine(input: ITimeOffBalanceFindInput & {
        page?: number;
        limit?: number;
    }): Promise<IPagination<ITimeOffBalance>>;
    /**
     * Set the accrued days of one employee/policy/year balance, creating the row if it is the
     * first allocation, and recompute `remaining`.
     *
     * This replaces `accrued` rather than adding to it, so re-running an allocation for a period
     * is idempotent instead of compounding.
     *
     * @param input employee, policy, year and the accrued days
     * @returns the updated balance
     */
    allocate(input: ITimeOffBalanceAllocateInput): Promise<ITimeOffBalance>;
    /**
     * Take days off the balance when a time off request is approved.
     *
     * @param input employee, policy, year and how many days to deduct
     * @returns the balance after the deduction
     */
    deduct(input: ITimeOffBalanceAdjustInput): Promise<ITimeOffBalance>;
    /**
     * Give days back when an approved request is cancelled or denied after the fact.
     *
     * @param input employee, policy, year and how many days to restore
     * @returns the balance after the reversal
     */
    reverse(input: ITimeOffBalanceAdjustInput): Promise<ITimeOffBalance>;
    /**
     * Roll each employee's unused days of one policy from one year into the next.
     *
     * The days are moved, not copied: the source year records them in `carriedOut` and stops
     * counting them as remaining, so the same day is never available in two years at once.
     * Re-running it is safe — both sides are *set* to the computed value rather than added to.
     *
     * @param input policy, source year, target year and an optional cap
     * @returns how many employee balances were rolled over
     */
    carryForward(input: ITimeOffBalanceCarryForwardInput): Promise<{
        carried: number;
    }>;
    /**
     * `accrued + carriedForward - taken - carriedOut`, never below zero.
     */
    private computeRemaining;
    /**
     * The employee whose balances the caller is allowed to see.
     *
     * Holders of `CHANGE_SELECTED_EMPLOYEE` may look at anybody (or at everybody, by passing no
     * `employeeId`); everybody else is pinned to their own record.
     */
    private resolveVisibleEmployeeId;
    /**
     * Fetch a balance row, or create a zeroed one if this is the first time it is needed.
     *
     * The insert can lose a race against a concurrent caller; the unique index on
     * `(tenantId, organizationId, employeeId, policyId, year)` turns that into an error rather
     * than a duplicate row, and the loser simply re-reads the winner's row.
     *
     * @param key employee, policy, year, tenant and organization
     * @param manager an optional transactional entity manager
     * @returns the existing or newly created balance
     */
    private findOrCreate;
    /**
     * Apply a signed change to `taken` in one statement, so concurrent approvals cannot lose an
     * update. When `spending` is true the statement only matches if enough days are left.
     *
     * @returns the number of rows the statement changed (0 or 1)
     */
    private applyDelta;
    /**
     * Read one balance or fail if it does not exist.
     */
    private getOrFail;
    /**
     * Refuse to touch an employee or a policy from another tenant or organization.
     */
    private assertEmployeeAndPolicyExist;
}
