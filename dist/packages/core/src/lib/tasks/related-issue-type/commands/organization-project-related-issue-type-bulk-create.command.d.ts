import { ICommand } from '@nestjs/cqrs';
import { IOrganizationProject } from '@gauzy/contracts';
export declare class OrganizationProjectRelatedIssueTypeBulkCreateCommand implements ICommand {
    readonly input: IOrganizationProject;
    static readonly type = "[Organization Project] Task RelatedIssueType Bulk Create";
    constructor(input: IOrganizationProject);
}
