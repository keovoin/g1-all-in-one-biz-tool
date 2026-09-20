import { IPagination } from '@gauzy/contracts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPluginTenantUsersResult, ManagePluginTenantUsersResult } from '../../application/plugin-tenant';
import { PluginTenantUserType } from '../../application/plugin-tenant/queries';
import { IPluginTenant, IPluginTenantAccessCheckResult, IPluginTenantQuotaInfo, IPluginTenantStatistics } from '../../shared';
import { CreatePluginTenantDTO, ManagePluginTenantUsersDTO, PluginTenantApprovalDTO, PluginTenantBulkOperationDTO, PluginTenantConfigurationDTO, PluginTenantQueryDTO, UpdatePluginTenantDTO } from '../../shared/dto';
export declare class PluginTenantController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Create a new plugin tenant relationship
     */
    create(createDto: CreatePluginTenantDTO): Promise<IPluginTenant>;
    /**
     * Get all plugin tenants with optional filtering
     */
    findAll(query: PluginTenantQueryDTO): Promise<IPluginTenant[]>;
    /**
     * Get plugin tenant statistics
     */
    getStatistics(tenantId?: string, organizationId?: string): Promise<IPluginTenantStatistics>;
    /**
     * Get plugin tenants by plugin ID
     */
    findByPlugin(pluginId: string, skip?: number, take?: number): Promise<IPluginTenant[]>;
    /**
     * Get plugin tenants by tenant ID
     */
    findByTenant(tenantId: string, organizationId?: string, skip?: number, take?: number): Promise<IPagination<IPluginTenant>>;
    /**
     * Check user access to a plugin
     */
    checkAccess(userId: string, pluginId: string, tenantId?: string, organizationId?: string, userRoles?: any[]): Promise<IPluginTenantAccessCheckResult>;
    /**
     * Get plugin tenant by ID
     */
    findOne(id: string): Promise<IPluginTenant>;
    /**
     * Get quota information for a plugin tenant
     */
    getQuotaInfo(id: string): Promise<IPluginTenantQuotaInfo>;
    /**
     * Get users for a plugin tenant (allowed, denied, or all)
     */
    getPluginTenantUsers(id: string, type?: PluginTenantUserType, skip?: number, take?: number, searchTerm?: string): Promise<GetPluginTenantUsersResult>;
    /**
     * Manage users for a plugin tenant (allow, deny, remove)
     */
    managePluginTenantUsers(id: string, dto: ManagePluginTenantUsersDTO): Promise<ManagePluginTenantUsersResult>;
    /**
     * Update plugin tenant
     */
    update(id: string, updateDto: UpdatePluginTenantDTO): Promise<IPluginTenant>;
    /**
     * Update plugin tenant configuration
     */
    updateConfiguration(configDto: PluginTenantConfigurationDTO): Promise<IPluginTenant>;
    /**
     * Enable plugin tenant
     */
    enable(id: string): Promise<IPluginTenant>;
    /**
     * Disable plugin tenant
     */
    disable(id: string): Promise<IPluginTenant>;
    /**
     * Approve or reject plugin tenant
     */
    updateApproval(approvalDto: PluginTenantApprovalDTO): Promise<IPluginTenant>;
    /**
     * Bulk update plugin tenants
     */
    bulkUpdate(bulkDto: PluginTenantBulkOperationDTO): Promise<{
        success: IPluginTenant[];
        failed: Array<{
            id: string;
            error: string;
        }>;
    }>;
    /**
     * Delete plugin tenant
     */
    remove(id: string): Promise<void>;
}
