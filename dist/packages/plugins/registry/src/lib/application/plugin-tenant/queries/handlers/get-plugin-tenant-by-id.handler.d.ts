import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenant } from '../../../../shared';
import { GetPluginTenantByIdQuery } from '../get-plugin-tenant-by-id.query';
export declare class GetPluginTenantByIdHandler implements IQueryHandler<GetPluginTenantByIdQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the get plugin tenant by ID query
     *
     * @param query - The query containing plugin tenant ID
     * @returns The plugin tenant with full relations
     * @throws NotFoundException if plugin tenant not found
     */
    execute(query: GetPluginTenantByIdQuery): Promise<IPluginTenant>;
}
