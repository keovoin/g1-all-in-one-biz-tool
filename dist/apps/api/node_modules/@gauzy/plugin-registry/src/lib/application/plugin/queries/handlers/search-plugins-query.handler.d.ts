import { IPagination, IPlugin } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginService } from '../../../../domain';
import { SearchPluginsQuery } from '../search-plugins.query';
/**
 * Query handler for searching and filtering plugins with advanced criteria
 */
export declare class SearchPluginsQueryHandler implements IQueryHandler<SearchPluginsQuery> {
    private readonly pluginService;
    constructor(pluginService: PluginService);
    /**
     * Executes the SearchPluginsQuery and returns paginated plugin results with filtering
     * @param query - The query containing search and filter parameters
     * @returns A promise resolving to paginated plugin results
     */
    execute(query: SearchPluginsQuery): Promise<IPagination<IPlugin>>;
    /**
     * Search and filter plugins with advanced criteria using QueryBuilder
     * @param filters - Search and filter criteria
     * @returns Promise resolving to paginated plugin results
     */
    private searchAndFilter;
}
