import { LegacyFindManyOptions } from '@gauzy/core';
import { IQuery } from '@nestjs/cqrs';
import { PluginCategory } from '../../../domain';
export declare class GetPluginCategoriesQuery implements IQuery {
    readonly options?: LegacyFindManyOptions<PluginCategory>;
    static readonly type = "[Plugin Category] Get Categories";
    constructor(options?: LegacyFindManyOptions<PluginCategory>);
}
