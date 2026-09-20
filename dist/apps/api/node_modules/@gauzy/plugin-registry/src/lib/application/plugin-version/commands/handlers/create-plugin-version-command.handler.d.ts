import { IPluginVersion } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { PluginService, PluginSourceService, PluginVersionService } from '../../../../domain';
import { CreatePluginVersionCommand } from '../create-plugin-version.command';
export declare class CreatePluginVersionCommandHandler implements ICommandHandler<CreatePluginVersionCommand> {
    private readonly pluginVersionService;
    private readonly pluginSourceService;
    private readonly pluginService;
    constructor(pluginVersionService: PluginVersionService, pluginSourceService: PluginSourceService, pluginService: PluginService);
    /**
     * Handles the execution of the CreatePluginVersionCommand.
     *
     * @param {CreatePluginVersionCommand} command - The command instance containing plugin ID and DTO.
     * @returns {Promise<IPluginVersion>} - The created plugin version.
     * @throws {NotFoundException} - If the plugin with the given ID does not exist.
     */
    execute(command: CreatePluginVersionCommand): Promise<IPluginVersion>;
}
