import { IPagination, ITimeOffBalance } from '@gauzy/contracts';
import { AdjustTimeOffBalanceDTO, AllocateTimeOffBalanceDTO, CarryForwardTimeOffBalanceDTO, TimeOffBalanceQueryDTO } from './dto';
import { TimeOffBalanceService } from './time-off-balance.service';
/**
 * Leave balances per employee, per policy, per year (issue #314).
 *
 * `GET /time-off-balance` and `GET /time-off-balance/me` are the two routes the MCP server's
 * `get_time_off_balance` and `get_my_time_off_balance` tools already call — until now they 404.
 *
 * Reading needs the Time Off view permission, and a caller without `CHANGE_SELECTED_EMPLOYEE`
 * only ever sees their own balances. Changing one needs the Time Off edit permission, because an
 * allocation decides how much leave somebody may take.
 */
export declare class TimeOffBalanceController {
    private readonly timeOffBalanceService;
    constructor(timeOffBalanceService: TimeOffBalanceService);
    /**
     * The current employee's own leave balances.
     *
     * @param options the policy and year to filter by
     * @returns the caller's balances
     */
    findMine(options: TimeOffBalanceQueryDTO): Promise<IPagination<ITimeOffBalance>>;
    /**
     * List leave balances, optionally narrowed by employee, policy and year.
     *
     * @param options the filters to apply
     * @returns the matching balances
     */
    findAll(options: TimeOffBalanceQueryDTO): Promise<IPagination<ITimeOffBalance>>;
    /**
     * Set the accrued days of one employee/policy/year balance.
     *
     * @param input employee, policy, year and the accrued days
     * @returns the updated balance
     */
    allocate(input: AllocateTimeOffBalanceDTO): Promise<ITimeOffBalance>;
    /**
     * Spend days from a balance, e.g. when a time off request is approved.
     *
     * @param input employee, policy, year and how many days to deduct
     * @returns the balance after the deduction
     */
    deduct(input: AdjustTimeOffBalanceDTO): Promise<ITimeOffBalance>;
    /**
     * Give days back to a balance, e.g. when an approved request is cancelled.
     *
     * @param input employee, policy, year and how many days to restore
     * @returns the balance after the reversal
     */
    reverse(input: AdjustTimeOffBalanceDTO): Promise<ITimeOffBalance>;
    /**
     * Roll unused days of one policy from one year into the next.
     *
     * @param input policy, source year, target year and an optional cap
     * @returns how many employee balances were rolled over
     */
    carryForward(input: CarryForwardTimeOffBalanceDTO): Promise<{
        carried: number;
    }>;
}
