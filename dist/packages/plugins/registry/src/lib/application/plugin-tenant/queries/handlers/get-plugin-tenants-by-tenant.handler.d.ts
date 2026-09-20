import { IPagination } from '@gauzy/contracts';
import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { GetPluginTenantsByTenantQuery } from '../get-plugin-tenants-by-tenant.query';
export declare class GetPluginTenantsByTenantHandler implements IQueryHandler<GetPluginTenantsByTenantQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the get plugin tenants by tenant query
     *
     * @param query - The query containing tenant ID and optional organization ID
     * @returns Array of plugin tenants for the specified tenant/organization
     * @throws BadRequestException if tenant ID is invalid
     */
    execute(query: GetPluginTenantsByTenantQuery): Promise<IPagination<IPluginTenant>>;
}
