import { ID } from '@gauzy/contracts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePluginDTO, FileDTO, IPlugin, UpdatePluginDTO } from '../../shared';
export declare class PluginManagementController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Creates a new plugin in the system.
     */
    create(input: CreatePluginDTO, files: FileDTO[]): Promise<IPlugin>;
    /**
     * Updates an existing plugin by ID.
     */
    update(id: ID, input: UpdatePluginDTO, files: FileDTO[]): Promise<IPlugin>;
    /**
     * Validate that files match the required sources
     */
    private validateFilesAgainstSources;
    /**
     * Find the appropriate file for a given source
     */
    private findFileForSource;
    /**
     * Partially updates an existing plugin by ID.
     */
    partialUpdate(id: ID, input: Partial<UpdatePluginDTO>): Promise<IPlugin>;
    /**
     * Deletes a plugin by ID.
     */
    delete(id: ID): Promise<void>;
    /**
     * Retrieves plugin tenant ID for a specific plugin.
     * If the plugin tenant doesn't exist, it will be created.
     */
    getPluginTenant(id: ID): Promise<{
        id: ID;
        pluginId: ID;
    }>;
}
