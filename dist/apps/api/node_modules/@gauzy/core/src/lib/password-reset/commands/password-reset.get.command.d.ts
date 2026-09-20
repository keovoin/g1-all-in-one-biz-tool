import { ICommand } from '@nestjs/cqrs';
import { IPasswordResetFindInput } from '@gauzy/contracts';
export declare class PasswordResetGetCommand implements ICommand {
    readonly input: IPasswordResetFindInput;
    static readonly type = "[Password Reset] Get";
    constructor(input: IPasswordResetFindInput);
}
