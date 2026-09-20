import { ICommand } from '@nestjs/cqrs';
import { IOrganization } from '@gauzy/contracts';
export declare class OrganizationTaskPriorityBulkCreateCommand implements ICommand {
    readonly input: IOrganization;
    static readonly type = "[Organization] Task Priority Bulk Create";
    constructor(input: IOrganization);
}
