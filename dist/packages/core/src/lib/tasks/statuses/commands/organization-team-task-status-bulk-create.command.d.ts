import { ICommand } from '@nestjs/cqrs';
import { IOrganizationTeam } from '@gauzy/contracts';
export declare class OrganizationTeamTaskStatusBulkCreateCommand implements ICommand {
    readonly input: IOrganizationTeam;
    static readonly type = "[Organization Team] Task Status Bulk Create";
    constructor(input: IOrganizationTeam);
}
