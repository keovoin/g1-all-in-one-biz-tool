import { ICommand } from '@nestjs/cqrs';
import { ICommentCreateInput } from '@gauzy/contracts';
export declare class CommentCreateCommand implements ICommand {
    readonly input: ICommentCreateInput;
    static readonly type = "[Comment] Create";
    constructor(input: ICommentCreateInput);
}
