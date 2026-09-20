import { IChangelogCreateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ChangelogCreateCommand implements ICommand {
    readonly input: IChangelogCreateInput;
    static readonly type = "[Changelog] Create";
    constructor(input: IChangelogCreateInput);
}
