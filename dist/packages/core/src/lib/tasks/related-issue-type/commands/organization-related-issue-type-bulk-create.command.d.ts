import { ICommand } from '@nestjs/cqrs';
import { IOrganization } from '@gauzy/contracts';
export declare class OrganizationRelatedIssueTypeBulkCreateCommand implements ICommand {
    readonly input: IOrganization;
    static readonly type = "[Organization RelatedIssueType] Bulk Create";
    constructor(input: IOrganization);
}
