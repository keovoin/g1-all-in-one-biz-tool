import { ID, IRole, IUser, PluginScope } from '@gauzy/contracts';
export declare class CreatePluginTenantDTO {
    pluginId: ID;
    enabled: boolean;
    scope: PluginScope;
    tenantId?: ID;
    organizationId?: ID;
    /**
     * Access Control & Permissions
     */
    autoInstall?: boolean;
    requiresApproval?: boolean;
    isMandatory?: boolean;
    /**
     * Usage Limits & Quotas
     */
    maxInstallations?: number;
    maxActiveUsers?: number;
    /**
     * Tenant-Specific Configuration
     */
    tenantConfiguration?: Record<string, any>;
    preferences?: Record<string, any>;
    /**
     * Compliance & Security
     */
    isDataCompliant?: boolean;
    complianceCertifications?: string[];
    /**
     * Access Control - Role IDs
     */
    allowedRoleIds?: ID[];
    allowedUserIds?: ID[];
    deniedUserIds?: ID[];
    /**
     * Access Control - Objects (for nested operations)
     */
    allowedRoles?: IRole[];
    allowedUsers?: IUser[];
    deniedUsers?: IUser[];
}
