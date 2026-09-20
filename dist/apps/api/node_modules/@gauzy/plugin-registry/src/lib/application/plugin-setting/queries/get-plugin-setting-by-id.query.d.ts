import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
export declare class GetPluginSettingByIdQuery implements IQuery {
    readonly id: ID;
    readonly relations?: string[];
    readonly tenantId?: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Setting] Get By ID";
    constructor(id: ID, relations?: string[], tenantId?: ID, organizationId?: ID);
}
