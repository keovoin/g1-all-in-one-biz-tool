import { ID } from '@gauzy/contracts';
export declare class PluginTenantApprovalDTO {
    pluginTenantId: ID;
    approved: boolean;
    notes?: string;
    enableImmediately?: boolean;
}
