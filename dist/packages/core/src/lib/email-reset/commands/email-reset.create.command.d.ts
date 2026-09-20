import { ICommand } from '@nestjs/cqrs';
import { IEmailResetCreateInput } from '@gauzy/contracts';
export declare class EmailResetCreateCommand implements ICommand {
    readonly input: IEmailResetCreateInput;
    static readonly type = "[Email Reset] Create";
    constructor(input: IEmailResetCreateInput);
}
