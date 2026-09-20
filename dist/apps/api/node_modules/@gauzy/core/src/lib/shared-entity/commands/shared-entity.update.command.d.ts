import { ICommand } from "@nestjs/cqrs";
import { ID, ISharedEntityUpdateInput } from "@gauzy/contracts";
export declare class SharedEntityUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: ISharedEntityUpdateInput;
    static readonly type = "[SharedEntity] Update";
    constructor(id: ID, input: ISharedEntityUpdateInput);
}
