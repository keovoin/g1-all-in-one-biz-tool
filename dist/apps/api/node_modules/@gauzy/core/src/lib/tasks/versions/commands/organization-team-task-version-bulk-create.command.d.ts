import { ICommand } from '@nestjs/cqrs';
import { IOrganizationTeam } from '@gauzy/contracts';
export declare class OrganizationTeamTaskVersionBulkCreateCommand implements ICommand {
    readonly input: IOrganizationTeam;
    static readonly type = "[Organization Team] Task Version Bulk Create";
    constructor(input: IOrganizationTeam);
}
