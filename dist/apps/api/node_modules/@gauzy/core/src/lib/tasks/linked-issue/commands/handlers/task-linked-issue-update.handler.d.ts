import { ICommandHandler } from '@nestjs/cqrs';
import { ITaskLinkedIssue } from '@gauzy/contracts';
import { TaskLinkedIssueUpdateCommand } from '../task-linked-issue-update.command';
import { TaskLinkedIssueService } from '../../task-linked-issue.service';
export declare class TaskLinkedIssueUpdateHandler implements ICommandHandler<TaskLinkedIssueUpdateCommand> {
    private readonly taskLinkedIssueService;
    constructor(taskLinkedIssueService: TaskLinkedIssueService);
    execute(command: TaskLinkedIssueUpdateCommand): Promise<ITaskLinkedIssue>;
}
