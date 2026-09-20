import { ICommand } from '@nestjs/cqrs';
import { IOrganizationTeam } from '@gauzy/contracts';
export declare class OrganizationTeamIssueTypeBulkCreateCommand implements ICommand {
    readonly input: IOrganizationTeam;
    static readonly type = "[Organization Team] Issue Type Bulk Create";
    constructor(input: IOrganizationTeam);
}
