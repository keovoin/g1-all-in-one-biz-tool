import { ICommand } from '@nestjs/cqrs';
import { ITaskLinkedIssueCreateInput } from '@gauzy/contracts';
export declare class TaskLinkedIssueCreateCommand implements ICommand {
    readonly input: ITaskLinkedIssueCreateInput;
    static readonly type = "[Task Linked Issue] Create";
    constructor(input: ITaskLinkedIssueCreateInput);
}
