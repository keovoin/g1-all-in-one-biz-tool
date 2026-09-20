import { IRequestApproval, ApprovalPolicyTypesStringEnum, IApprovalPolicy, IRequestApprovalEmployee, IRequestApprovalTeam, ITag, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class RequestApproval extends TenantOrganizationBaseEntity implements IRequestApproval {
    name: string;
    status: number;
    min_count: number;
    requestId: ID;
    requestType: ApprovalPolicyTypesStringEnum;
    /**
     * The approval policy associated with this request approval.
     */
    approvalPolicy?: IApprovalPolicy;
    /**
     * The ID for the associated approval policy.
     */
    approvalPolicyId?: ID;
    /**
     * The employees associated with this request approval.
     */
    employeeApprovals?: IRequestApprovalEmployee[];
    /**
     * The teams associated with this request approval.
     */
    teamApprovals?: IRequestApprovalTeam[];
    /**
     * The tags associated with this request approval.
     */
    tags?: ITag[];
}
