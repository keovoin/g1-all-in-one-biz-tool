import { ID, ITimeOffBalanceAllocateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
/**
 * Set the accrued days of one employee/policy/year balance.
 */
export declare class AllocateTimeOffBalanceDTO extends TenantOrganizationBaseDTO implements ITimeOffBalanceAllocateInput {
    readonly employeeId: ID;
    readonly policyId: ID;
    readonly year: number;
    readonly accrued: number;
}
