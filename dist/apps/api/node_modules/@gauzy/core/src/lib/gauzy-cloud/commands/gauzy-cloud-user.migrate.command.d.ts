import { ICommand } from '@nestjs/cqrs';
import { IUserRegistrationInput } from '@gauzy/contracts';
export declare class GauzyCloudUserMigrateCommand implements ICommand {
    readonly input: IUserRegistrationInput;
    static readonly type = "[Gauzy Cloud] User Migrate";
    constructor(input: IUserRegistrationInput);
}
