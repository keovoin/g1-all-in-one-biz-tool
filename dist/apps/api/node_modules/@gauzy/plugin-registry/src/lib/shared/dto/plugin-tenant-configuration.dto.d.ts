import { ID } from '@gauzy/contracts';
export declare class PluginTenantConfigurationDTO {
    pluginTenantId: ID;
    configuration?: Record<string, any>;
    preferences?: Record<string, any>;
}
