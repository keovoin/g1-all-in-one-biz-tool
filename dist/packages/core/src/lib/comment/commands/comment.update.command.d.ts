import { ICommand } from '@nestjs/cqrs';
import { ICommentUpdateInput, ID } from '@gauzy/contracts';
export declare class CommentUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: ICommentUpdateInput;
    static readonly type = "[Comment] Update";
    constructor(id: ID, input: ICommentUpdateInput);
}
