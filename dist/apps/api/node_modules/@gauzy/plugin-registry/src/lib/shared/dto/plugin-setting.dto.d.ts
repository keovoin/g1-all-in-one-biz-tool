import { PluginSettingDataType } from '@gauzy/contracts';
/**
 * Create Plugin Setting DTO
 */
export declare class CreatePluginSettingDTO {
    pluginId: string;
    pluginTenantId?: string;
    key: string;
    value?: any;
    isRequired?: boolean;
    isEncrypted?: boolean;
    description?: string;
    order?: number;
    validationRules?: Record<string, any>;
    dataType?: PluginSettingDataType;
    defaultValue?: any;
}
/**
 * Update Plugin Setting DTO
 */
export declare class UpdatePluginSettingDTO {
    value?: any;
    dataType?: PluginSettingDataType;
    isRequired?: boolean;
    isEncrypted?: boolean;
    defaultValue?: any;
    description?: string;
    order?: number;
    validationRules?: Record<string, any>;
}
/**
 * Plugin Setting Query DTO
 */
export declare class PluginSettingQueryDTO {
    pluginId?: string;
    pluginTenantId?: string;
    key?: string;
    category?: string;
    dataType?: PluginSettingDataType;
}
/**
 * Bulk Update Plugin Settings DTO
 */
export declare class BulkUpdatePluginSettingsDTO {
    pluginId: string;
    pluginTenantId?: string;
    settings: Array<{
        key: string;
        value: any;
    }>;
}
/**
 * Set Plugin Setting Value DTO
 */
export declare class SetPluginSettingValueDTO {
    pluginId: string;
    key: string;
    value: any;
    pluginTenantId?: string;
}
