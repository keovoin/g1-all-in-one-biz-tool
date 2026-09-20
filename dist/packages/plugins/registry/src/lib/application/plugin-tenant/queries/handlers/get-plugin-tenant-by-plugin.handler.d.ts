import { ID } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain/services/plugin-tenant.service';
import { GetPluginTenantByPluginQuery } from '../get-plugin-tenant-by-plugin.query';
export declare class GetPluginTenantByPluginHandler implements IQueryHandler<GetPluginTenantByPluginQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the query to get a plugin tenant by plugin ID
     * If the plugin tenant doesn't exist, it will be created
     *
     * @param query - The query containing pluginId, tenantId, and optional organizationId
     * @returns Object with id and pluginId
     */
    execute(query: GetPluginTenantByPluginQuery): Promise<{
        id: ID;
        pluginId: ID;
    }>;
}
