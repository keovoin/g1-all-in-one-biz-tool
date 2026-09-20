import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSourceService } from '../../../../domain';
import { RecoverPluginSourceCommand } from '../recover-plugin-source.command';
/**
 * Command handler responsible for recovering a soft-deleted plugin source.
 */
export declare class RecoverPluginSourceCommandHandler implements ICommandHandler<RecoverPluginSourceCommand> {
    private readonly pluginSourceService;
    constructor(pluginSourceService: PluginSourceService);
    /**
     * Executes the recover plugin source command.
     * This method attempts to restore a previously soft-deleted plugin source.
     *
     * @param command - The command containing the plugin source ID, version ID and associated plugin ID.
     * @throws NotFoundException if the specified plugin source is not found.
     * @throws BadRequestException if the recovery operation fails.
     */
    execute(command: RecoverPluginSourceCommand): Promise<void>;
}
