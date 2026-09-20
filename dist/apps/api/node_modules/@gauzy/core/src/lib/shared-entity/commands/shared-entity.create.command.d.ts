import { ICommand } from "@nestjs/cqrs";
import { ISharedEntityCreateInput } from "@gauzy/contracts";
export declare class SharedEntityCreateCommand implements ICommand {
    readonly input: ISharedEntityCreateInput;
    static readonly type = "[SharedEntity] Create";
    constructor(input: ISharedEntityCreateInput);
}
