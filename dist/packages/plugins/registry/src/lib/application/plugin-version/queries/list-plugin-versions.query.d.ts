import { ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { IQuery } from '@nestjs/cqrs';
import { IPluginVersion } from '../../../shared';
/**
 * Query to fetch paginated list of plugin versions
 */
export declare class ListPluginVersionsQuery implements IQuery {
    readonly pluginId: ID;
    readonly params: BaseQueryDTO<IPluginVersion>;
    static readonly type = "[Plugin Versions] List";
    /**
     * @param params - Pagination and filtering parameters for plugin versions
     */
    constructor(pluginId: ID, params: BaseQueryDTO<IPluginVersion>);
}
