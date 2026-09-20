import { ICommand } from '@nestjs/cqrs';
import { IPasswordReset } from '@gauzy/contracts';
export declare class PasswordResetCreateCommand implements ICommand {
    readonly input: IPasswordReset;
    static readonly type = "[Password Reset] Create";
    constructor(input: IPasswordReset);
}
