import { IQuery } from '@nestjs/cqrs';
import { PluginTenantQueryDTO } from '../../../shared/dto/plugin-tenant-query.dto';
export declare class GetAllPluginTenantsQuery implements IQuery {
    readonly filter?: PluginTenantQueryDTO;
    static readonly type = "[Plugin Tenant] Get All";
    constructor(filter?: PluginTenantQueryDTO);
}
