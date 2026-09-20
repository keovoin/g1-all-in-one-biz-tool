import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskLinkedIssue } from '@gauzy/contracts';
import { TaskLinkedIssueCreateCommand } from '../task-linked-issue-create.command';
import { TaskLinkedIssueService } from '../../task-linked-issue.service';
export declare class TaskLinkedIssueCreateHandler implements ICommandHandler<TaskLinkedIssueCreateCommand> {
    private readonly taskLinkedIssueService;
    constructor(taskLinkedIssueService: TaskLinkedIssueService);
    execute(command: TaskLinkedIssueCreateCommand): Promise<ITaskLinkedIssue>;
}
