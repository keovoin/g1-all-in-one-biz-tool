import { ICommand } from '@nestjs/cqrs';
import { IOrganizationProject } from '@gauzy/contracts';
export declare class OrganizationProjectStatusBulkCreateCommand implements ICommand {
    readonly input: IOrganizationProject;
    static readonly type = "[Organization Project] Task Status Bulk Create";
    constructor(input: IOrganizationProject);
}
