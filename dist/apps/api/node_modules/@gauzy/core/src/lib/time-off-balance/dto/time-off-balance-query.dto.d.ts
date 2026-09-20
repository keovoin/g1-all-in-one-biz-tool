import { ID, ITimeOffBalanceFindInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
/**
 * Query filters for listing leave balances.
 */
export declare class TimeOffBalanceQueryDTO extends TenantOrganizationBaseDTO implements ITimeOffBalanceFindInput {
    readonly employeeId?: ID;
    readonly policyId?: ID;
    readonly year?: number;
    readonly page?: number;
    readonly limit?: number;
}
