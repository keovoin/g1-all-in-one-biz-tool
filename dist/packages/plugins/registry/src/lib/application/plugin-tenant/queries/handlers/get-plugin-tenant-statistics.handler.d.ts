import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenantStatistics } from '../../../../shared';
import { GetPluginTenantStatisticsQuery } from '../get-plugin-tenant-statistics.query';
export declare class GetPluginTenantStatisticsHandler implements IQueryHandler<GetPluginTenantStatisticsQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the get plugin tenant statistics query
     *
     * @param query - The query containing optional tenant and organization filters
     * @returns Statistics about plugin tenant usage
     */
    execute(query: GetPluginTenantStatisticsQuery): Promise<IPluginTenantStatistics>;
}
