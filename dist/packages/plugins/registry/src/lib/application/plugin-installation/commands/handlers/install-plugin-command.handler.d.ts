import { ICommandHandler } from '@nestjs/cqrs';
import { PluginInstallationService, PluginSubscriptionAccessService } from '../../../../domain';
import { IPluginInstallation } from '../../../../shared';
import { InstallPluginCommand } from '../../commands/install-plugin.command';
/**
 * Command handler responsible for handling the installation of plugins.
 */
export declare class InstallPluginCommandHandler implements ICommandHandler<InstallPluginCommand> {
    /**
     * Service responsible for handling plugin installation logic.
     */
    private readonly installationService;
    /**
     * Service responsible for validating plugin subscription access.
     */
    private readonly subscriptionAccessService;
    private readonly accessDeniedMessages;
    constructor(
    /**
     * Service responsible for handling plugin installation logic.
     */
    installationService: PluginInstallationService, 
    /**
     * Service responsible for validating plugin subscription access.
     */
    subscriptionAccessService: PluginSubscriptionAccessService);
    /**
     * Executes the command to install a plugin.
     *
     * @param command - The install plugin command containing the plugin ID and version information.
     * @returns A promise that resolves when the plugin installation is completed.
     * @throws {NotFoundException} If the plugin installation entry is not found.
     * @throws {ForbiddenException} If user doesn't have proper subscription for plugin installation.
     */
    execute(command: InstallPluginCommand): Promise<IPluginInstallation>;
    private ensurePluginAccess;
}
