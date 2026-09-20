import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
import { PluginQueryOptions } from '../../../shared';
export declare class GetPluginQuery implements IQuery {
    readonly id: ID;
    readonly options: PluginQueryOptions;
    static readonly type = "[Plugin] Get";
    constructor(id: ID, options: PluginQueryOptions);
}
