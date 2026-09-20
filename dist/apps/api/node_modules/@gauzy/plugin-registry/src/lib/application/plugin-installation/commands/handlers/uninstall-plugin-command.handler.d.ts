import { ICommandHandler } from '@nestjs/cqrs';
import { PluginInstallationService } from '../../../../domain';
import { UninstallPluginCommand } from '../uninstall-plugin.command';
/**
 * Command handler for uninstalling a plugin.
 */
export declare class UninstallPluginCommandHandler implements ICommandHandler<UninstallPluginCommand> {
    private readonly installationService;
    /**
     * Constructor for UninstallPluginCommandHandler.
     *
     * @param installationService - The plugin installation service.
     */
    constructor(installationService: PluginInstallationService);
    /**
     * Executes the command to uninstall a plugin.
     *
     * @param command - The uninstall plugin command containing the input data.
     * @returns A promise that resolves when the plugin uninstallation is complete.
     * @throws {NotFoundException} If the plugin installation is not found.
     */
    execute(command: UninstallPluginCommand): Promise<void>;
}
