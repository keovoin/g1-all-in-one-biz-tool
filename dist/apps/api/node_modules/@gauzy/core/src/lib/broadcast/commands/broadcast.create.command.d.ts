import { ICommand } from '@nestjs/cqrs';
import { IBroadcastCreateInput } from '@gauzy/contracts';
export declare class BroadcastCreateCommand implements ICommand {
    readonly input: IBroadcastCreateInput;
    static readonly type = "[Broadcast] Create";
    constructor(input: IBroadcastCreateInput);
}
