import { ID, IRole, IUser, PluginScope } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { Relation } from 'typeorm';
import { IPlugin, IPluginSetting, IPluginSubscription, IPluginTenant } from '../../shared';
/**
 * PluginTenant Entity
 * Manages plugin installation and configuration at the tenant/organization level
 * Handles access control, usage limits, and tenant-specific customizations
 */
export declare class PluginTenant extends TenantOrganizationBaseEntity implements IPluginTenant {
    pluginId: ID;
    enabled: boolean;
    scope: PluginScope;
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
    currentInstallations?: number;
    currentActiveUsers?: number;
    /**
     * Tenant-Specific Configuration
     */
    tenantConfiguration?: Record<string, any>;
    preferences?: Record<string, any>;
    /**
     * Compliance & Security
     */
    approvedAt?: Date;
    isDataCompliant?: boolean;
    complianceCertifications?: string[];
    approvedById?: ID;
    plugin: Relation<IPlugin>;
    approvedBy?: Relation<IUser>;
    settings?: Relation<IPluginSetting[]>;
    subscriptions?: Relation<IPluginSubscription[]>;
    allowedRoles?: Relation<IRole[]>;
    allowedUsers?: Relation<IUser[]>;
    deniedUsers?: Relation<IUser[]>;
    get isQuotaExceeded(): boolean;
    get hasLimits(): boolean;
    get installationUtilization(): number;
    get userUtilization(): number;
    /**
     * Check if plugin is available for use in this tenant
     * @returns true if plugin is enabled
     */
    isAvailable(): boolean;
    /**
     * Check if user has access to this plugin based on roles and explicit permissions
     * @param userId - User ID to check
     * @param userRoles - Array of roles the user has
     * @returns true if user has access
     */
    hasUserAccess(userId: string, userRoles: IRole[]): boolean;
    /**
     * Check if tenant can install more instances based on quota
     * @returns true if more installations are allowed
     */
    canInstallMore(): boolean;
    /**
     * Check if tenant can add more active users based on quota
     * @returns true if more users can be added
     */
    canAddMoreUsers(): boolean;
    /**
     * Check if plugin is mandatory for users in this tenant
     * @returns true if plugin is mandatory and available
     */
    isMandatoryForTenant(): boolean;
    /**
     * Check if plugin requires approval for installation
     * @returns true if approval is required
     */
    needsApprovalForInstallation(): boolean;
    /**
     * Check if plugin can be auto-installed
     * @returns true if auto-install is enabled and requirements are met
     */
    canAutoInstall(): boolean;
    /**
     * Get effective configuration for this plugin tenant
     * @returns Merged configuration object
     */
    getEffectiveConfiguration(): Record<string, any>;
    /**
     * Update tenant-specific configuration (merges with existing)
     * @param config - Configuration object to merge
     */
    updateConfiguration(config: Record<string, any>): void;
    /**
     * Replace entire tenant configuration
     * @param config - New configuration object
     */
    setConfiguration(config: Record<string, any>): void;
    /**
     * Update tenant preferences (merges with existing)
     * @param prefs - Preferences object to merge
     */
    updatePreferences(prefs: Record<string, any>): void;
    /**
     * Replace entire preferences
     * @param prefs - New preferences object
     */
    setPreferences(prefs: Record<string, any>): void;
    /**
     * Increment installation count
     * @throws Error if quota would be exceeded
     */
    incrementInstallations(): void;
    /**
     * Decrement installation count (safely prevents negative values)
     */
    decrementInstallations(): void;
    /**
     * Increment active user count
     * @throws Error if quota would be exceeded
     */
    incrementActiveUsers(): void;
    /**
     * Decrement active user count (safely prevents negative values)
     */
    decrementActiveUsers(): void;
    /**
     * Reset usage counters to zero
     */
    resetUsageCounters(): void;
    /**
     * Enable plugin for tenant
     */
    enable(): void;
    /**
     * Mark plugin as archived (cannot be enabled unless restored)
     */
    archive(): void;
    /**
     * Restore plugin from archived state
     */
    restore(): void;
    /**
     * Disable plugin for tenant
     */
    disable(): void;
    /**
     * Toggle plugin enabled state
     * @returns New enabled state
     */
    toggleEnabled(): boolean;
    /**
     * Approve plugin for tenant
     * @param approvedBy - User who approved the plugin
     */
    approve(approvedBy: IUser): void;
    /**
     * Revoke approval for plugin
     */
    revokeApproval(): void;
    /**
     * Check if plugin is approved
     * @returns true if plugin has been approved
     */
    isApproved(): boolean;
    /**
     * Add user to allowed list
     * @param user - User to allow
     */
    allowUser(user: IUser): void;
    /**
     * Remove user from allowed list
     * @param userId - ID of user to remove from allowed list
     */
    removeAllowedUser(userId: string): void;
    /**
     * Add user to denied list
     * @param user - User to deny
     */
    denyUser(user: IUser): void;
    /**
     * Remove user from denied list
     * @param userId - ID of user to remove from denied list
     */
    removeDeniedUser(userId: string): void;
    /**
     * Clear all user-specific access controls
     */
    clearUserAccessControls(): void;
    /**
     * Add role to allowed list
     * @param role - Role to allow
     */
    allowRole(role: IRole): void;
    /**
     * Remove role from allowed list
     * @param roleId - ID of role to remove
     */
    removeAllowedRole(roleId: string): void;
    /**
     * Clear all role-based access controls
     */
    clearRoleAccessControls(): void;
    /**
     * Clear all access controls (both users and roles)
     */
    clearAllAccessControls(): void;
    /**
     * Factory method to create a new plugin-tenant relationship
     * @param params - Configuration parameters
     * @returns New PluginTenant instance
     */
    static create(params: Partial<IPluginTenant>): PluginTenant;
    /**
     * Create a plugin tenant with unlimited access
     * @param input - Plugin to create tenant relationship for
     * @returns New PluginTenant instance with no restrictions
     */
    static createUnlimited(input: IPluginTenant): PluginTenant;
    /**
     * Create a plugin tenant with strict restrictions
     * @param plugin - Plugin to create tenant relationship for
     * @param allowedRoles - Roles that can access the plugin
     * @returns New PluginTenant instance with restrictions
     */
    static createRestricted(input: IPluginTenant, allowedRoles?: IRole[]): PluginTenant;
}
