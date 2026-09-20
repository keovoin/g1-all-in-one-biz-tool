import { ID } from '@gauzy/contracts';
export declare enum PluginTenantBulkOperation {
    ENABLE = "enable",
    DISABLE = "disable",
    APPROVE = "approve",
    REVOKE = "revoke",
    DELETE = "delete"
}
export declare class PluginTenantBulkOperationDTO {
    pluginTenantIds: ID[];
    operation: PluginTenantBulkOperation;
    data?: Record<string, any>;
    notes?: string;
}
