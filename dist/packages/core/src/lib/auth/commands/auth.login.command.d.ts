import { ICommand } from '@nestjs/cqrs';
import { IUserLoginInput } from '@gauzy/contracts';
export declare class AuthLoginCommand implements ICommand {
    readonly input: IUserLoginInput;
    static readonly type = "[Auth] Login";
    constructor(input: IUserLoginInput);
}
