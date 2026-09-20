import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * Proposal template common request DTO validation
 *
 */
export declare class ProposalTemplateDTO extends TenantOrganizationBaseDTO {
    readonly name: string;
    readonly content: string;
    readonly isDefault: boolean;
}
