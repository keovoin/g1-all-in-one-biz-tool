import { IUserUpdateInput, LanguagesEnum } from '@gauzy/contracts';
export declare class UpdatePreferredLanguageDTO implements IUserUpdateInput {
    readonly preferredLanguage: LanguagesEnum;
}
