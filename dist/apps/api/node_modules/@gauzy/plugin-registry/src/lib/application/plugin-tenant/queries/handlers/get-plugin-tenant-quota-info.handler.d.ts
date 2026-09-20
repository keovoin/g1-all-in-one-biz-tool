import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenantQuotaInfo } from '../../../../shared';
import { GetPluginTenantQuotaInfoQuery } from '../get-plugin-tenant-quota-info.query';
export declare class GetPluginTenantQuotaInfoHandler implements IQueryHandler<GetPluginTenantQuotaInfoQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the get plugin tenant quota info query
     *
     * @param query - The query containing plugin tenant ID
     * @returns Quota information for the plugin tenant
     * @throws BadRequestException if plugin tenant ID is missing
     * @throws NotFoundException if plugin tenant not found
     */
    execute(query: GetPluginTenantQuotaInfoQuery): Promise<IPluginTenantQuotaInfo>;
}
