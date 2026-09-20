import { ID, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePluginSourceDTO, FileDTO, IPluginSource, IPluginVersion } from '../../shared';
export declare class PluginSourceController {
    private readonly queryBus;
    private readonly commandBus;
    constructor(queryBus: QueryBus, commandBus: CommandBus);
    findAllSources(pluginId: ID, versionId: ID, params: BaseQueryDTO<IPluginVersion>): Promise<IPagination<IPluginVersion>>;
    create(pluginId: ID, versionId: ID, input: CreatePluginSourceDTO, files: FileDTO[]): Promise<IPluginSource[]>;
    /**
     * Validate that files match the required sources
     */
    private validateFilesAgainstSources;
    /**
     * Find the appropriate file for a given source
     */
    private findFileForSource;
    /**
     * Deletes a plugin source by ID.
     */
    delete(sourceId: ID, versionId: ID, pluginId: ID): Promise<void>;
    /**
     * Update plugin source status (including restoration)
     */
    updateStatus(sourceId: ID, versionId: ID, pluginId: ID, updateDto: {
        status: 'active' | 'inactive' | 'deleted' | 'restored';
    }): Promise<void>;
}
