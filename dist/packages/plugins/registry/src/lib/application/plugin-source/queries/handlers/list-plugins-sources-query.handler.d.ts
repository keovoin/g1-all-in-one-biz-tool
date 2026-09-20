import { IPagination, IPluginSource } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginService, PluginSourceService } from '../../../../domain';
import { ListPluginSourcesQuery } from '../list-plugin-sources.query';
/**
 * Query handler for listing plugin sources with pagination and filtering capabilities.
 * Handles filtering by plugin ID and version ID, with proper relation management.
 */
export declare class ListPluginSourcesQueryHandler implements IQueryHandler<ListPluginSourcesQuery> {
    private readonly pluginSourceService;
    private readonly pluginService;
    constructor(pluginSourceService: PluginSourceService, pluginService: PluginService);
    /**
     * Handles the ListPluginSourcesQuery and returns a paginated list of plugin sources.
     *
     * @param query - The query containing plugin ID, version ID, and pagination options
     * @throws {BadRequestException} When required parameters are invalid
     * @returns Promise<IPagination<IPluginSource>> A paginated list of plugin sources
     */
    execute(query: ListPluginSourcesQuery): Promise<IPagination<IPluginSource>>;
}
