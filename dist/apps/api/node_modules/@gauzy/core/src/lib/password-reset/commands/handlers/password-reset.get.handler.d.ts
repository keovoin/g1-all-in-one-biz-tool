import { ICommandHandler } from '@nestjs/cqrs';
import { IPasswordReset } from '@gauzy/contracts';
import { PasswordResetGetCommand } from './../password-reset.get.command';
import { PasswordResetService } from './../../password-reset.service';
export declare class PasswordResetGetHandler implements ICommandHandler<PasswordResetGetCommand> {
    private readonly _passwordResetService;
    constructor(_passwordResetService: PasswordResetService);
    /**
     * Executes the PasswordResetGetCommand to retrieve a password reset entry.
     *
     * This method searches for a password reset entry based on the provided token and returns the latest entry (sorted by createdAt in descending order).
     *
     * - If the token is found, the corresponding password reset entry is returned.
     * - If no matching token is found, a NotFoundException is thrown.
     *
     * @param {PasswordResetGetCommand} command - The command containing the input data, specifically the token for the password reset request.
     * @returns {Promise<IPasswordReset>} - A promise that resolves to the matching password reset entry.
     * @throws {NotFoundException} - If no password reset entry is found for the provided token.
     */
    execute(command: PasswordResetGetCommand): Promise<IPasswordReset>;
}
