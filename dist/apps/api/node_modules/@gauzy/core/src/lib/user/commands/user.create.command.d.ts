import { ICommand } from '@nestjs/cqrs';
import { IUserCreateInput } from '@gauzy/contracts';
export declare class UserCreateCommand implements ICommand {
    readonly input: IUserCreateInput;
    static readonly type = "[User] Create";
    constructor(input: IUserCreateInput);
}
