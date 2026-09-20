import { ICommand } from '@nestjs/cqrs';
import { IReactionUpdateInput, ID } from '@gauzy/contracts';
export declare class ReactionUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IReactionUpdateInput;
    static readonly type = "[Reaction] Update";
    constructor(id: ID, input: IReactionUpdateInput);
}
