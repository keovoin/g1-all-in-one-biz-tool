import { IPlugin } from '@gauzy/contracts';
import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { PluginService, PluginSourceService, PluginVersionService } from '../../../../domain';
import { CreatePluginCommand } from '../create-plugin.command';
export declare class CreatePluginCommandHandler implements ICommandHandler<CreatePluginCommand> {
    private readonly versionService;
    private readonly sourceService;
    private readonly pluginService;
    private readonly dataSource;
    private readonly commandBus;
    constructor(versionService: PluginVersionService, sourceService: PluginSourceService, pluginService: PluginService, dataSource: DataSource, commandBus: CommandBus);
    /**
     * Executes the create plugin command
     *
     * @param command - The command containing plugin creation data
     * @returns The created plugin
     * @throws BadRequestException if validation fails
     */
    execute(command: CreatePluginCommand): Promise<IPlugin>;
}
