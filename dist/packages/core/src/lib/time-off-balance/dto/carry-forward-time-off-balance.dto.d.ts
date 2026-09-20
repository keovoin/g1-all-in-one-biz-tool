import { ID, ITimeOffBalanceCarryForwardInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
/**
 * Roll unused days of one policy from one year into the next.
 */
export declare class CarryForwardTimeOffBalanceDTO extends TenantOrganizationBaseDTO implements ITimeOffBalanceCarryForwardInput {
    readonly policyId: ID;
    readonly fromYear: number;
    readonly toYear: number;
    readonly maxCarryForwardDays?: number;
}
