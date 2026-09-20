import { ICommandHandler } from '@nestjs/cqrs';
import { PluginVersionService } from '../../../../domain';
import { RecoverPluginVersionCommand } from '../recover-plugin-version.command';
/**
 * Command handler responsible for recovering a soft-deleted plugin version.
 */
export declare class RecoverPluginVersionCommandHandler implements ICommandHandler<RecoverPluginVersionCommand> {
    private readonly pluginVersionService;
    constructor(pluginVersionService: PluginVersionService);
    /**
     * Executes the recover plugin version command.
     * This method attempts to restore a previously soft-deleted plugin version.
     *
     * @param command - The command containing the plugin version ID and associated plugin ID.
     * @throws NotFoundException if the specified plugin version is not found.
     * @throws BadRequestException if the recovery operation fails.
     */
    execute(command: RecoverPluginVersionCommand): Promise<void>;
}
