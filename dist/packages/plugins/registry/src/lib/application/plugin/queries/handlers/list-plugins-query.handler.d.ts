import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginService } from '../../../../domain';
import { IPlugin } from '../../../../shared';
import { ListPluginsQuery } from '../list-plugins.query';
export declare class ListPluginsQueryHandler implements IQueryHandler<ListPluginsQuery> {
    private readonly pluginService;
    constructor(pluginService: PluginService);
    /**
     * Executes the ListPluginsQuery and returns paginated plugin results
     * @param query - The query containing pagination and filter parameters
     * @returns A promise resolving to paginated plugin results
     */
    execute(query: ListPluginsQuery): Promise<IPagination<IPlugin>>;
}
