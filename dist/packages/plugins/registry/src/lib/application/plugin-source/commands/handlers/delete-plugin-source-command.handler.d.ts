import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSourceService } from '../../../../domain';
import { DeletePluginSourceCommand } from '../delete-plugin-source.command';
export declare class DeletePluginSourceCommandHandler implements ICommandHandler<DeletePluginSourceCommand> {
    private readonly pluginSourceService;
    constructor(pluginSourceService: PluginSourceService);
    /**
     * Executes the delete plugin source command.
     * It attempts to soft delete the plugin source by sourceId, versionId and pluginId.
     *
     * @param command - The command containing the plugin source details
     * @throws NotFoundException if the plugin source is not found
     * @throws BadRequestException if the deletion fails
     */
    execute(command: DeletePluginSourceCommand): Promise<void>;
}
