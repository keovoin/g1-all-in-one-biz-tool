import { ICommandHandler } from '@nestjs/cqrs';
import { PluginInstallationService } from '../../../../domain';
import { ActivatePluginCommand } from '../activate-plugin.command';
/**
 * Command handler for activating plugin installations
 */
export declare class ActivatePluginCommandHandler implements ICommandHandler<ActivatePluginCommand> {
    private readonly pluginInstallationService;
    constructor(pluginInstallationService: PluginInstallationService);
    /**
     * Activates a plugin installation if the current user has permission
     * @param command - Command containing the installation ID to activate
     * @returns Promise resolving to void upon successful activation
     * @throws BadRequestException if installation ID is missing
     * @throws NotFoundException if installation doesn't exist
     */
    execute(command: ActivatePluginCommand): Promise<{
        success: boolean;
        message: string;
    }>;
}
