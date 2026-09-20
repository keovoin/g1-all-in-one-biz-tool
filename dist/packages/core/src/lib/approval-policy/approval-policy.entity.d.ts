import { IApprovalPolicy } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class ApprovalPolicy extends TenantOrganizationBaseEntity implements IApprovalPolicy {
    name: string;
    description: string;
    approvalType: string;
}
