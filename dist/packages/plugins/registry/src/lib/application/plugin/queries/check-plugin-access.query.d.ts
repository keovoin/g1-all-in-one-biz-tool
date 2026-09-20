import { ID } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
import { PluginAccessCheckDTO } from '../../../shared';
export declare class CheckPluginAccessQuery implements IQuery {
    readonly accessCheckDto: PluginAccessCheckDTO;
    readonly tenantId: ID;
    readonly organizationId?: ID;
    static readonly type = "[Plugin Subscription] Check Access";
    constructor(accessCheckDto: PluginAccessCheckDTO, tenantId: ID, organizationId?: ID);
}
