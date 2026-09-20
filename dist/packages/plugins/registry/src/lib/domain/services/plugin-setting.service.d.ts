import { TenantAwareCrudService } from '@gauzy/core';
import { IPluginSetting, IPluginSettingCreateInput, IPluginSettingUpdateInput } from '../../shared/models/plugin-setting.model';
import { PluginSetting } from '../entities/plugin-setting.entity';
import { MikroOrmPluginSettingRepository } from '../repositories/mikro-orm-plugin-setting.repository';
import { TypeOrmPluginSettingRepository } from '../repositories/type-orm-plugin-setting.repository';
export declare class PluginSettingService extends TenantAwareCrudService<PluginSetting> {
    readonly typeOrmPluginSettingRepository: TypeOrmPluginSettingRepository;
    readonly mikroOrmPluginSettingRepository: MikroOrmPluginSettingRepository;
    private readonly logger;
    constructor(typeOrmPluginSettingRepository: TypeOrmPluginSettingRepository, mikroOrmPluginSettingRepository: MikroOrmPluginSettingRepository);
    /**
     * Create a new plugin setting with validation
     */
    createSetting(input: IPluginSettingCreateInput): Promise<IPluginSetting>;
    /**
     * Update plugin setting with validation
     */
    updateSetting(id: string, input: IPluginSettingUpdateInput): Promise<IPluginSetting>;
    /**
     * Find plugin settings by plugin ID with enhanced filtering
     */
    findByPluginId(pluginId: string, relations?: string[], tenantId?: string, organizationId?: string): Promise<IPluginSetting[]>;
    /**
     * Find plugin settings by plugin tenant ID with enhanced filtering
     */
    findByPluginTenantId(pluginTenantId: string, relations?: string[], tenantId?: string, organizationId?: string): Promise<IPluginSetting[]>;
    /**
     * Find a specific plugin setting by key with validation
     */
    findByKey(pluginId: string, key: string, pluginTenantId?: string, relations?: string[]): Promise<IPluginSetting | null>;
    /**
     * Get plugin settings by category with enhanced validation
     */
    findByCategory(pluginId: string, categoryId: string, pluginTenantId?: string, relations?: string[], tenantId?: string, organizationId?: string): Promise<IPluginSetting[]>;
    /**
     * Get setting value with type safety
     */
    getSettingValue<T = any>(pluginId: string, key: string, pluginTenantId?: string, defaultValue?: T): Promise<T | null>;
    /**
     * Set setting value with type conversion
     */
    setSettingValue(pluginId: string, key: string, value: any, pluginTenantId?: string, tenantId?: string, organizationId?: string): Promise<IPluginSetting>;
    /**
     * Bulk update settings with transaction support
     */
    bulkUpdateSettings(pluginId: string, settings: Array<{
        key: string;
        value: any;
        categoryId?: string;
    }>, pluginTenantId?: string, tenantId?: string, organizationId?: string): Promise<IPluginSetting[]>;
    /**
     * Delete setting by key
     */
    deleteByKey(pluginId: string, key: string, pluginTenantId?: string): Promise<void>;
    /**
     * Check if a setting exists
     */
    exists(pluginId: string, key: string, pluginTenantId?: string): Promise<boolean>;
    /**
     * Validate setting value against its configuration
     */
    validateSetting(setting: IPluginSetting, value: any): Promise<boolean>;
    private validateCreateInput;
    private validatePluginId;
    private validateKey;
    private validateCategory;
    private processSettingValue;
}
