import { ICommandHandler } from '@nestjs/cqrs';
import { IIssueType } from '@gauzy/contracts';
import { OrganizationProjectIssueTypeBulkCreateCommand } from '../organization-project-issue-type-bulk-create.command';
import { IssueTypeService } from '../../issue-type.service';
export declare class OrganizationProjectIssueTypeBulkCreateHandler implements ICommandHandler<OrganizationProjectIssueTypeBulkCreateCommand> {
    private readonly issueTypeService;
    constructor(issueTypeService: IssueTypeService);
    execute(command: OrganizationProjectIssueTypeBulkCreateCommand): Promise<IIssueType[]>;
}
