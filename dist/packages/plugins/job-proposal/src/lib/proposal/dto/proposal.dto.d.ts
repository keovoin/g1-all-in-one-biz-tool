import { IOrganizationContact, ProposalStatusEnum } from "@gauzy/contracts";
import { TenantOrganizationBaseDTO } from "@gauzy/core";
export declare class ProposalDTO extends TenantOrganizationBaseDTO {
    readonly jobPostUrl: string;
    readonly valueDate: Date;
    readonly jobPostContent: string;
    readonly proposalContent: string;
    readonly status: ProposalStatusEnum;
    readonly organizationContact: IOrganizationContact;
    readonly organizationContactId: string;
}
