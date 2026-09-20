import { ICommand } from '@nestjs/cqrs';
import { IOrganizationTeam } from '@gauzy/contracts';
export declare class OrganizationTeamTaskRelatedIssueTypeBulkCreateCommand implements ICommand {
    readonly input: IOrganizationTeam;
    static readonly type = "[Organization Team] Task RelatedIssueType Bulk Create";
    constructor(input: IOrganizationTeam);
}
