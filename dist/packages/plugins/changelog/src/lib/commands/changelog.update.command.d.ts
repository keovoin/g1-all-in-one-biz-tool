import { IChangelogUpdateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ChangelogUpdateCommand implements ICommand {
    readonly input: IChangelogUpdateInput;
    static readonly type = "[Changelog] Update";
    constructor(input: IChangelogUpdateInput);
}
