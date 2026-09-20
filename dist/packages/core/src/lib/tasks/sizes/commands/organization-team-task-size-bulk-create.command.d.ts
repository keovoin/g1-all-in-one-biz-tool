import { ICommand } from '@nestjs/cqrs';
import { IOrganizationTeam } from '@gauzy/contracts';
export declare class OrganizationTeamTaskSizeBulkCreateCommand implements ICommand {
    readonly input: IOrganizationTeam;
    static readonly type = "[Organization Team] Task Size Bulk Create";
    constructor(input: IOrganizationTeam);
}
