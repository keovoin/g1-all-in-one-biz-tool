import { IOrganizationTeam, IRequestApproval, IRequestApprovalTeam } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class RequestApprovalTeam extends TenantOrganizationBaseEntity implements IRequestApprovalTeam {
    status: number;
    requestApproval: IRequestApproval;
    requestApprovalId: string;
    team: IOrganizationTeam;
    teamId: string;
}
