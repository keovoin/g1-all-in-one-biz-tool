import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginCategoryQuery implements IQuery {
    readonly id: ID;
    readonly relations?: string[];
    static readonly type = "[Plugin Category] Get Category";
    constructor(id: ID, relations?: string[]);
}
