import { ICommandHandler } from '@nestjs/cqrs';
import { PluginInstallationService } from '../../../../domain';
import { DeactivatePluginCommand } from '../deactivate-plugin.command';
/**
 * Command handler for deactivating plugin installations
 */
export declare class DeactivatePluginCommandHandler implements ICommandHandler<DeactivatePluginCommand> {
    private readonly pluginInstallationService;
    constructor(pluginInstallationService: PluginInstallationService);
    /**
     * Deactivates a plugin installation if the current user has permission
     * @param command - Command containing the installation ID to deactivate
     * @returns Promise resolving to void upon successful deactivation
     * @throws BadRequestException if installation ID is missing
     * @throws NotFoundException if installation doesn't exist
     */
    execute(command: DeactivatePluginCommand): Promise<{
        success: boolean;
        message: string;
    }>;
}
