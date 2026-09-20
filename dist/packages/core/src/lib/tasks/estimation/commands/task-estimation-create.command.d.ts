import { ICommand } from '@nestjs/cqrs';
import { ITaskEstimationCreateInput } from '@gauzy/contracts';
export declare class TaskEstimationCreateCommand implements ICommand {
    readonly input: ITaskEstimationCreateInput;
    static readonly type = "[Task Estimation] Create Task Estimation";
    constructor(input: ITaskEstimationCreateInput);
}
