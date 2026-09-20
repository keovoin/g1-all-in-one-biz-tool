import { ICommand } from '@nestjs/cqrs';
import { ID, ITaskLinkedIssueUpdateInput } from '@gauzy/contracts';
export declare class TaskLinkedIssueUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: ITaskLinkedIssueUpdateInput;
    static readonly type = "[Task Linked Issue] Update";
    constructor(id: ID, input: ITaskLinkedIssueUpdateInput);
}
