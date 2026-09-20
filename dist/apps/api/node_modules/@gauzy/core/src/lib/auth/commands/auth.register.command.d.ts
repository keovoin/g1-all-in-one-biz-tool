import { ICommand } from '@nestjs/cqrs';
import { IAppIntegrationConfig } from '@gauzy/common';
import { IUserRegistrationInput, LanguagesEnum } from '@gauzy/contracts';
export declare class AuthRegisterCommand implements ICommand {
    readonly input: IUserRegistrationInput & Partial<IAppIntegrationConfig>;
    readonly languageCode: LanguagesEnum;
    static readonly type = "[Auth] Register";
    constructor(input: IUserRegistrationInput & Partial<IAppIntegrationConfig>, languageCode: LanguagesEnum);
}
