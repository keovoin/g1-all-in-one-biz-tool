import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginTenantByIdQuery implements IQuery {
    readonly id: ID;
    static readonly type = "[Plugin Tenant] Get By Id";
    constructor(id: ID);
}
