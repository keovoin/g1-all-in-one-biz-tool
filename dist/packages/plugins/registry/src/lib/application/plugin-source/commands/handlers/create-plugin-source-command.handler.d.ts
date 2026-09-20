import { IPluginSource } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { PluginSourceService, PluginVersionService } from '../../../../domain';
import { CreatePluginSourceCommand } from '../../commands/create-plugin-source.command';
export declare class CreatePluginSourceCommandHandler implements ICommandHandler<CreatePluginSourceCommand> {
    private readonly pluginVersionService;
    private readonly pluginSourceService;
    constructor(pluginVersionService: PluginVersionService, pluginSourceService: PluginSourceService);
    /**
     * Handles the execution of the CreatePluginVersionCommand.
     *
     * @param {CreatePluginSourceCommand} command - The command instance containing plugin ID and DTO.
     * @returns {Promise<IPluginSource[]>} - The created plugin source.
     * @throws {NotFoundException} - If the plugin with the given ID does not exist.
     */
    execute(command: CreatePluginSourceCommand): Promise<IPluginSource[]>;
}
