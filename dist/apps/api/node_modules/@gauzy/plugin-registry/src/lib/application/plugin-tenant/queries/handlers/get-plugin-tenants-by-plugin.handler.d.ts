import { IQueryHandler } from '@nestjs/cqrs';
import { IPagination } from '@gauzy/contracts';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { GetPluginTenantsByPluginQuery } from '../get-plugin-tenants-by-plugin.query';
export declare class GetPluginTenantsByPluginHandler implements IQueryHandler<GetPluginTenantsByPluginQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the get plugin tenants by plugin query
     *
     * @param query - The query containing plugin ID
     * @returns Array of plugin tenants for the specified plugin
     * @throws BadRequestException if plugin ID is invalid
     */
    execute(query: GetPluginTenantsByPluginQuery): Promise<IPagination<IPluginTenant>>;
}
