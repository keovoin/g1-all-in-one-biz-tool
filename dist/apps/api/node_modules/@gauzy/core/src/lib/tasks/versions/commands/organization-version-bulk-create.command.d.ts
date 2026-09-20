import { ICommand } from '@nestjs/cqrs';
import { IOrganization } from '@gauzy/contracts';
export declare class OrganizationVersionBulkCreateCommand implements ICommand {
    readonly input: IOrganization;
    static readonly type = "[Organization Version] Bulk Create";
    constructor(input: IOrganization);
}
