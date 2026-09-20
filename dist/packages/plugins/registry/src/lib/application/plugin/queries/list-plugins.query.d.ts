import { BaseQueryDTO } from '@gauzy/core';
import { IQuery } from '@nestjs/cqrs';
import { IPlugin } from '../../../shared';
/**
 * Query to fetch paginated list of plugins
 */
export declare class ListPluginsQuery implements IQuery {
    readonly params: Partial<BaseQueryDTO<IPlugin>>;
    static readonly type = "[Plugins] List";
    /**
     * @param params - Pagination and filtering parameters for plugins
     */
    constructor(params: Partial<BaseQueryDTO<IPlugin>>);
}
