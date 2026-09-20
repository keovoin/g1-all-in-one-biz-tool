import { ID, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileDTO, IPluginVersion, PluginVersionDTO, UpdatePluginVersionDTO } from '../../shared';
export declare class PluginVersionController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    findAllVersions(id: ID, params: BaseQueryDTO<IPluginVersion>): Promise<IPagination<IPluginVersion>>;
    createVersion(id: ID, input: PluginVersionDTO, files: FileDTO[]): Promise<IPluginVersion>;
    /**
     * Updates an existing plugin version by IDs.
     */
    update(versionId: ID, pluginId: ID, input: UpdatePluginVersionDTO, files: FileDTO[]): Promise<IPluginVersion>;
    /**
     * Update plugin version status (including restoration)
     */
    updateStatus(versionId: ID, pluginId: ID, updateDto: {
        status: 'active' | 'inactive' | 'deleted' | 'restored';
    }): Promise<void>;
    /**
     * Deletes a plugin by ID.
     */
    delete(versionId: ID, pluginId: ID): Promise<void>;
    private validateFilesAgainstSources;
    /**
     * Find the appropriate file for a given source
     */
    private findFileForSource;
}
