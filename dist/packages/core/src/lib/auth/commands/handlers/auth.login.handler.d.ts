import { ICommandHandler } from '@nestjs/cqrs';
import { IAuthResponse } from '@gauzy/contracts';
import { AuthLoginCommand } from '../auth.login.command';
import { AuthService } from '../../auth.service';
export declare class AuthLoginHandler implements ICommandHandler<AuthLoginCommand> {
    private readonly authService;
    constructor(authService: AuthService);
    /**
     * Executes the authentication login command.
     *
     * @param command The authentication login command containing user input.
     * @returns A promise that resolves to an authentication response or null.
     */
    execute(command: AuthLoginCommand): Promise<IAuthResponse | null>;
}
