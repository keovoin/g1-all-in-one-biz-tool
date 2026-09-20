import { ICommand } from '@nestjs/cqrs';
import { ITagCreateInput } from '@gauzy/contracts';
export declare class TagCreateCommand implements ICommand {
    readonly input: ITagCreateInput;
    static readonly type = "[Tag] Create Task";
    constructor(input: ITagCreateInput);
}
