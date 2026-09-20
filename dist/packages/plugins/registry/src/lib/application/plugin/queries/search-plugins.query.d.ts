import { IQuery } from '@nestjs/cqrs';
import { PluginSearchFilterDTO } from '../../../shared';
/**
 * Query to search and filter plugins with advanced criteria
 */
export declare class SearchPluginsQuery implements IQuery {
    readonly filters: PluginSearchFilterDTO;
    static readonly type = "[Plugins] Search";
    /**
     * @param filters - Search and filtering criteria for plugins
     */
    constructor(filters: PluginSearchFilterDTO);
}
