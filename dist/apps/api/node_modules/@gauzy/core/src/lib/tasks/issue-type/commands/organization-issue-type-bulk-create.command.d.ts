import { ICommand } from '@nestjs/cqrs';
import { IOrganization } from '@gauzy/contracts';
export declare class OrganizationIssueTypeBulkCreateCommand implements ICommand {
    readonly input: IOrganization;
    static readonly type = "[Organization] Issue Type Bulk Create";
    constructor(input: IOrganization);
}
