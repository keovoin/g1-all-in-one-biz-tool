import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSecurityService, PluginService } from '../../../../domain';
import { VerifyPluginCommand } from '../../commands/verify-plugin.command';
/**
 * Command handler responsible for verifying plugin signatures.
 *
 * This handler processes VerifyPluginCommand requests and delegates to the
 * PluginSecurityService to authenticate plugin signatures against their version IDs.
 *
 * @implements {ICommandHandler<VerifyPluginCommand>}
 */
export declare class VerifyPluginCommandHandler implements ICommandHandler<VerifyPluginCommand> {
    private readonly securityService;
    private readonly pluginService;
    /**
     * Creates an instance of VerifyPluginCommandHandler.
     *
     * @param {PluginSecurityService} securityService - Service responsible for plugin security operations
     * @param {PluginService} pluginService - Service responsible for plugin operations
     */
    constructor(securityService: PluginSecurityService, pluginService: PluginService);
    /**
     * Executes the verify plugin command.
     *
     * Extracts the version ID and signature from the command input and
     * forwards them to the security service for verification.
     *
     * @param {VerifyPluginCommand} command - The command containing plugin verification data
     * @returns {Promise<boolean>} True if the signature is valid, false otherwise
     * @throws {NotFoundException} When the plugin with the specified ID is not found
     */
    execute(command: VerifyPluginCommand): Promise<boolean>;
}
