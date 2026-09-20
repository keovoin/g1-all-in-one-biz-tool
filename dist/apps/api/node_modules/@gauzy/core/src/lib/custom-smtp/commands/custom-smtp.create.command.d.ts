import { ICommand } from '@nestjs/cqrs';
import { ICustomSmtpCreateInput } from '@gauzy/contracts';
export declare class CustomSmtpCreateCommand implements ICommand {
    readonly input: ICustomSmtpCreateInput;
    static readonly type = "[Custom SMTP] Create";
    constructor(input: ICustomSmtpCreateInput);
}
