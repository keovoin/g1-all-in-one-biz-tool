import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskRelatedIssueType } from '@gauzy/contracts';
import { OrganizationTeamTaskRelatedIssueTypeBulkCreateCommand } from '../organization-team-task-related-issue-type-bulk-create.command';
import { TaskRelatedIssueTypeService } from '../../related-issue-type.service';
export declare class OrganizationTeamTaskRelatedIssueTypeBulkCreateHandler implements ICommandHandler<OrganizationTeamTaskRelatedIssueTypeBulkCreateCommand> {
    private readonly TaskRelatedIssueTypeervice;
    constructor(TaskRelatedIssueTypeervice: TaskRelatedIssueTypeService);
    execute(command: OrganizationTeamTaskRelatedIssueTypeBulkCreateCommand): Promise<ITaskRelatedIssueType[]>;
}
