import { ICommand } from '@nestjs/cqrs';
import { IOrganization } from '@gauzy/contracts';
export declare class OrganizationStatusBulkCreateCommand implements ICommand {
    readonly input: IOrganization;
    static readonly type = "[Organization Status] Bulk Create";
    constructor(input: IOrganization);
}
