import { ID, IPagination } from '@gauzy/contracts';
import { QueryBus } from '@nestjs/cqrs';
import { IPlugin, PluginQueryOptions, PluginSearchFilterDTO } from '../../shared';
export declare class PluginController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    /**
     * Retrieves a paginated list of plugins with optional filtering and search.
     */
    findAll(params: PluginSearchFilterDTO): Promise<IPagination<IPlugin>>;
    /**
     * Retrieves a plugin by ID.
     */
    findById(id: ID, options: PluginQueryOptions): Promise<IPlugin>;
}
