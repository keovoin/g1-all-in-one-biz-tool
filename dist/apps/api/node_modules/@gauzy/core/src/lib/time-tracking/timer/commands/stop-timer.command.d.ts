import { ICommand } from '@nestjs/cqrs';
import { ITimerToggleInput } from '@gauzy/contracts';
export declare class StopTimerCommand implements ICommand {
    readonly input: ITimerToggleInput;
    constructor(input: ITimerToggleInput);
}
