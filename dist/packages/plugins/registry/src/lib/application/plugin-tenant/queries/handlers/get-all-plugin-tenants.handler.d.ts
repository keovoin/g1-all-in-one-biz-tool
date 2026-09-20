import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { GetAllPluginTenantsQuery } from '../get-all-plugin-tenants.query';
export declare class GetAllPluginTenantsHandler implements IQueryHandler<GetAllPluginTenantsQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the get all plugin tenants query
     *
     * @param query - The query containing optional filters
     * @returns Array of plugin tenants matching the criteria
     */
    execute(query: GetAllPluginTenantsQuery): Promise<IPluginTenant[]>;
}
