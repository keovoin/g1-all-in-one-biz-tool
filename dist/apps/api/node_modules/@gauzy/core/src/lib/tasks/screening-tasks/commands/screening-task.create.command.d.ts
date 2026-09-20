import { ICommand } from '@nestjs/cqrs';
import { IScreeningTaskCreateInput } from '@gauzy/contracts';
export declare class ScreeningTaskCreateCommand implements ICommand {
    readonly input: IScreeningTaskCreateInput;
    static readonly type = "[ScreeningTask] Create";
    constructor(input: IScreeningTaskCreateInput);
}
