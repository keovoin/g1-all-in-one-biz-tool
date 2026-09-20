import { HttpStatus } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { PluginService } from '../../../../domain';
import { DeletePluginCommand } from '../delete-plugin.command';
export declare class DeletePluginCommandHandler implements ICommandHandler<DeletePluginCommand> {
    private readonly pluginService;
    constructor(pluginService: PluginService);
    /**
     * Executes the delete plugin command
     *
     * @param command - The command containing the plugin ID to delete
     * @throws NotFoundException if the plugin doesn't exist
     * @throws BadRequestException if the deletion fails
     */
    execute(command: DeletePluginCommand): Promise<{
        message: string;
        status: HttpStatus;
    }>;
}
