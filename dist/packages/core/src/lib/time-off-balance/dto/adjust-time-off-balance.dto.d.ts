import { ID, ITimeOffBalanceAdjustInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
/**
 * Spend days from, or give days back to, one employee/policy/year balance.
 *
 * `days` is always positive; the endpoint decides the direction, so a negative value can never
 * turn a deduction into a grant.
 */
export declare class AdjustTimeOffBalanceDTO extends TenantOrganizationBaseDTO implements ITimeOffBalanceAdjustInput {
    readonly employeeId: ID;
    readonly policyId: ID;
    readonly year: number;
    readonly days: number;
}
