import { ICommand } from '@nestjs/cqrs';
import { IReactionCreateInput } from '@gauzy/contracts';
export declare class ReactionCreateCommand implements ICommand {
    readonly input: IReactionCreateInput;
    static readonly type = "[Reaction] Create";
    constructor(input: IReactionCreateInput);
}
