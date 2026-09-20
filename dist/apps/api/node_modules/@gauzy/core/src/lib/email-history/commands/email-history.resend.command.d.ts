import { ICommand } from '@nestjs/cqrs';
import { ID, IResendEmailInput, LanguagesEnum } from '@gauzy/contracts';
export declare class EmailHistoryResendCommand implements ICommand {
    readonly id: ID;
    readonly input: IResendEmailInput;
    readonly languageCode: LanguagesEnum;
    static readonly type = "[Email History] Resend";
    constructor(id: ID, input: IResendEmailInput, languageCode: LanguagesEnum);
}
