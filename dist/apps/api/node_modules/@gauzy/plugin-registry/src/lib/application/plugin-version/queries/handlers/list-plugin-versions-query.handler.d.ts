import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginService, PluginVersionService } from '../../../../domain';
import { IPluginVersion } from '../../../../shared';
import { ListPluginVersionsQuery } from '../list-plugin-versions.query';
export declare class ListPluginVersionsQueryHandler implements IQueryHandler<ListPluginVersionsQuery> {
    private readonly pluginVersionService;
    private readonly pluginService;
    constructor(pluginVersionService: PluginVersionService, pluginService: PluginService);
    /**
     * Handles the ListPluginVersionsQuery and returns a paginated list of plugin versions.
     *
     * @param query - The query containing plugin ID and pagination options.
     * @returns A promise resolving to paginated plugin version results.
     */
    execute(query: ListPluginVersionsQuery): Promise<IPagination<IPluginVersion>>;
}
