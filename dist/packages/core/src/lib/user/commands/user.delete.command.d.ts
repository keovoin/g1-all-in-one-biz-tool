import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class UserDeleteCommand implements ICommand {
    readonly userId: ID;
    static readonly type = "[User] Delete Account";
    constructor(userId: ID);
}
