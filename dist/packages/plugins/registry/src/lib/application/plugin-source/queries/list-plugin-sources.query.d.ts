import { ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { IQuery } from '@nestjs/cqrs';
import { IPluginSource } from '../../../shared';
/**
 * Query to fetch paginated list of plugin sources
 */
export declare class ListPluginSourcesQuery implements IQuery {
    readonly pluginId: ID;
    readonly versionId: ID;
    readonly params: BaseQueryDTO<IPluginSource>;
    static readonly type = "[Plugin Sources] List";
    /**
     * @param params - Pagination and filtering parameters for plugin versions
     */
    constructor(pluginId: ID, versionId: ID, params: BaseQueryDTO<IPluginSource>);
}
