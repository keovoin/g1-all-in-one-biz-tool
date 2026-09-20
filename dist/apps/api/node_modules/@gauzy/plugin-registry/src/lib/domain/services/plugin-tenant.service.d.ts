import { IPagination, PluginScope } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { IPluginTenant } from '../../shared/models/plugin-tenant.model';
import { PluginTenant } from '../entities/plugin-tenant.entity';
import { MikroOrmPluginTenantRepository } from '../repositories/tenant/mikro-orm-plugin-tenant.repository';
import { TypeOrmPluginTenantRepository } from '../repositories/tenant/type-orm-plugin-tenant.repository';
export declare class PluginTenantService extends TenantAwareCrudService<PluginTenant> {
    readonly typeOrmPluginTenantRepository: TypeOrmPluginTenantRepository;
    readonly mikroOrmPluginTenantRepository: MikroOrmPluginTenantRepository;
    private readonly logger;
    constructor(typeOrmPluginTenantRepository: TypeOrmPluginTenantRepository, mikroOrmPluginTenantRepository: MikroOrmPluginTenantRepository);
    /**
     * Find or create a plugin tenant relationship
     * This ensures that a plugin tenant exists for the given plugin, tenant, and organization
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @returns The plugin tenant ID
     */
    findOrCreate(input: Partial<PluginTenant>): Promise<string>;
    /**
     * Find plugin tenant by plugin ID and tenant ID
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @returns The plugin tenant or null if not found
     */
    findByPluginAndTenant(pluginId: string, tenantId: string, organizationId?: string): Promise<IPluginTenant | null>;
    /**
     * Find all plugin tenants for a specific plugin
     *
     * @param pluginId - The plugin ID
     * @param relations - Optional relations to include
     * @param skip - Number of records to skip (for pagination)
     * @param take - Number of records to take (for pagination)
     * @returns IPagination of plugin tenants
     */
    findByPluginId(pluginId: string, relations?: string[], skip?: number, take?: number): Promise<IPagination<IPluginTenant>>;
    /**
     * Find all plugin tenants for a specific tenant
     *
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @param relations - Optional relations to include
     * @param skip - Number of records to skip (for pagination)
     * @param take - Number of records to take (for pagination)
     * @returns IPagination of plugin tenants
     */
    findByTenantId(tenantId: string, organizationId?: string, relations?: string[], skip?: number, take?: number): Promise<IPagination<IPluginTenant>>;
    /**
     * Enable plugin for a tenant
     *
     * @param pluginTenantId - The plugin tenant ID
     * @returns Updated plugin tenant
     */
    enablePlugin(pluginTenantId: string): Promise<IPluginTenant>;
    /**
     * Disable plugin for a tenant
     *
     * @param pluginTenantId - The plugin tenant ID
     * @returns Updated plugin tenant
     */
    disablePlugin(pluginTenantId: string): Promise<IPluginTenant>;
    /**
     * Update plugin scope for a tenant
     *
     * @param pluginTenantId - The plugin tenant ID
     * @param scope - The new scope
     * @returns Updated plugin tenant
     */
    updateScope(pluginTenantId: string, scope: PluginScope): Promise<IPluginTenant>;
    /**
     * Check if plugin is enabled for a tenant
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @returns True if plugin is enabled, false otherwise
     */
    isPluginEnabled(pluginId: string, tenantId: string, organizationId?: string): Promise<boolean>;
    /**
     * Delete plugin tenant relationship
     *
     * @param pluginTenantId - The plugin tenant ID
     */
    deletePluginTenant(pluginTenantId: string): Promise<void>;
    /**
     * Validate plugin tenant input
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     */
    private validatePluginTenantInput;
    /**
     * Validate plugin ID
     *
     * @param pluginId - The plugin ID
     */
    private validatePluginId;
    /**
     * Validate tenant ID
     *
     * @param tenantId - The tenant ID
     */
    private validateTenantId;
    exists(pluginTenantId: string): Promise<boolean>;
}
