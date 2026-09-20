import { IQueryHandler } from '@nestjs/cqrs';
import { PluginTenantService } from '../../../../domain';
import { IPluginTenantAccessCheckResult } from '../../../../shared';
import { CheckPluginTenantAccessQuery } from '../check-plugin-tenant-access.query';
export declare class CheckPluginTenantAccessHandler implements IQueryHandler<CheckPluginTenantAccessQuery> {
    private readonly pluginTenantService;
    constructor(pluginTenantService: PluginTenantService);
    /**
     * Executes the check plugin tenant access query
     *
     * @param query - The query containing user and plugin access check data
     * @returns Access check result with plugin tenant if access is granted
     * @throws BadRequestException if required parameters are missing
     */
    execute(query: CheckPluginTenantAccessQuery): Promise<IPluginTenantAccessCheckResult>;
}
