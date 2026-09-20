import { ICommand } from '@nestjs/cqrs';
import { IAppIntegrationConfig } from '@gauzy/common';
import { IUserEmailInput, LanguagesEnum } from '@gauzy/contracts';
export declare class WorkspaceSigninSendCodeCommand implements ICommand {
    readonly input: IUserEmailInput & Partial<IAppIntegrationConfig>;
    readonly locale: LanguagesEnum;
    static readonly type = "[Password Less] Send Workspace Signin Authentication Code";
    constructor(input: IUserEmailInput & Partial<IAppIntegrationConfig>, locale: LanguagesEnum);
}
