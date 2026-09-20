import { IPluginVersion } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { PluginSourceService, PluginVersionService } from '../../../../domain';
import { UpdatePluginVersionCommand } from '../update-plugin-version.command';
export declare class UpdatePluginVersionCommandHandler implements ICommandHandler<UpdatePluginVersionCommand> {
    private readonly versionService;
    private readonly sourceService;
    private readonly dataSource;
    constructor(versionService: PluginVersionService, sourceService: PluginSourceService, dataSource: DataSource);
    /**
     * Updates a plugin version and its associated source
     *
     * @param command - The update plugin version command with input data and plugin ID
     * @returns The updated plugin
     * @throws NotFoundException if source, or version is not found
     */
    execute(command: UpdatePluginVersionCommand): Promise<IPluginVersion>;
    /**
     * Updates a plugin source using the source service
     *
     * @param data - Source data to update
     * @param pluginId - ID of the plugin
     * @throws NotFoundException if source is not found
     */
    private updateSource;
    /**
     * Updates a plugin version using the version service
     *
     * @param data - Version data to update
     * @param pluginId - ID of the plugin
     * @throws NotFoundException if version is not found
     */
    private updateVersion;
}
