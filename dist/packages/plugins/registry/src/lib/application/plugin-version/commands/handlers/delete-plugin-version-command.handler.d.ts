import { ICommandHandler } from '@nestjs/cqrs';
import { PluginVersionService } from '../../../../domain';
import { DeletePluginVersionCommand } from '../delete-plugin-version.command';
export declare class DeletePluginVersionCommandHandler implements ICommandHandler<DeletePluginVersionCommand> {
    private readonly pluginVersionService;
    constructor(pluginVersionService: PluginVersionService);
    /**
     * Executes the delete plugin command.
     * It attempts to soft delete the plugin version by versionId and pluginId.
     *
     * @param command - The command containing the plugin version details
     * @throws NotFoundException if the plugin version is not found
     * @throws BadRequestException if the deletion fails
     */
    execute(command: DeletePluginVersionCommand): Promise<void>;
}
