import { ICommand } from '@nestjs/cqrs';
import { ID, IScreeningTaskUpdateInput } from '@gauzy/contracts';
export declare class ScreeningTaskUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IScreeningTaskUpdateInput;
    static readonly type = "[ScreeningTask] Update";
    constructor(id: ID, input: IScreeningTaskUpdateInput);
}
