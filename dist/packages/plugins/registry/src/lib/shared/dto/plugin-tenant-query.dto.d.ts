import { ID, PluginScope } from '@gauzy/contracts';
export declare class PluginTenantQueryDTO {
    pluginId?: ID;
    tenantId?: ID;
    organizationId?: ID;
    enabled?: boolean;
    scope?: PluginScope;
    isMandatory?: boolean;
    isDataCompliant?: boolean;
    isApproved?: boolean;
}
