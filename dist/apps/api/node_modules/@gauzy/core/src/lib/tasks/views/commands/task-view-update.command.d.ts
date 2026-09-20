import { ID, ITaskViewUpdateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class TaskViewUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: ITaskViewUpdateInput;
    static readonly type = "[Task View] Update";
    constructor(id: ID, input: ITaskViewUpdateInput);
}
