import { ITaskViewCreateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class TaskViewCreateCommand implements ICommand {
    readonly input: ITaskViewCreateInput;
    static readonly type = "[Task View] Create";
    constructor(input: ITaskViewCreateInput);
}
