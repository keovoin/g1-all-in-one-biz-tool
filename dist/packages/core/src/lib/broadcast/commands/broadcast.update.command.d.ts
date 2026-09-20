import { ICommand } from '@nestjs/cqrs';
import { IBroadcastUpdateInput, ID } from '@gauzy/contracts';
export declare class BroadcastUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IBroadcastUpdateInput;
    static readonly type = "[Broadcast] Update";
    constructor(id: ID, input: IBroadcastUpdateInput);
}
