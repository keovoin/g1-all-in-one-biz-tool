import { ICommand } from '@nestjs/cqrs';
import { IOrganizationProject } from '@gauzy/contracts';
export declare class OrganizationProjectTaskSizeBulkCreateCommand implements ICommand {
    readonly input: IOrganizationProject;
    static readonly type = "[Organization Project] Task Size Bulk Create";
    constructor(input: IOrganizationProject);
}
