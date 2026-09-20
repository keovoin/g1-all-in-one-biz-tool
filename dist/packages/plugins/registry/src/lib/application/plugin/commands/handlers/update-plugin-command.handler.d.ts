import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { PluginService, PluginSourceService, PluginVersionService } from '../../../../domain';
import { IPlugin } from '../../../../shared';
import { UpdatePluginCommand } from '../update-plugin.command';
export declare class UpdatePluginCommandHandler implements ICommandHandler<UpdatePluginCommand> {
    private readonly versionService;
    private readonly sourceService;
    private readonly pluginService;
    private readonly dataSource;
    private readonly commandBus;
    constructor(versionService: PluginVersionService, sourceService: PluginSourceService, pluginService: PluginService, dataSource: DataSource, commandBus: CommandBus);
    /**
     * Updates a plugin and its associated source and version
     *
     * @param command - The update plugin command with input data and plugin ID
     * @returns The updated plugin
     * @throws NotFoundException if plugin, source, or version is not found
     * @throws BadRequestException if plugin ID is missing or update fails
     */
    execute(command: UpdatePluginCommand): Promise<IPlugin>;
}
