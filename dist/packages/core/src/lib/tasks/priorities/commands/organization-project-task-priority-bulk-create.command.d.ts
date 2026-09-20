import { ICommand } from '@nestjs/cqrs';
import { IOrganizationProject } from '@gauzy/contracts';
export declare class OrganizationProjectTaskPriorityBulkCreateCommand implements ICommand {
    readonly input: IOrganizationProject;
    static readonly type = "[Organization Project] Task Priority Bulk Create";
    constructor(input: IOrganizationProject);
}
