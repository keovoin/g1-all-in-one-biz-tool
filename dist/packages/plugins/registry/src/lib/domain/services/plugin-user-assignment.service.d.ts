import { RoleService } from '@gauzy/core';
import { PluginTenantService } from './plugin-tenant.service';
export interface UserAssignmentRecord {
    id?: string;
    pluginTenantId: string;
    userId: string;
    reason?: string;
    assignedAt: Date;
    unassignedAt?: Date;
    status: 'assigned' | 'unassigned';
}
export interface UserAccessCheckWhere {
    pluginId?: string;
    pluginTenantId?: string;
    tenantId?: string;
    organizationId?: string;
}
/**
 * Service for managing plugin user assignments
 * Uses PluginTenantService to handle plugin access control and user assignments
 */
export declare class PluginUserAssignmentService {
    private readonly pluginTenantService;
    private readonly roleService;
    private readonly logger;
    constructor(pluginTenantService: PluginTenantService, roleService: RoleService);
    /**
     * Assign a list of users to a plugin installation.
     * This method manages user access through the plugin tenant configuration.
     *
     * @param pluginTenantId - The plugin tenant ID (not installation ID for compatibility)
     * @param userIds - Array of user IDs to assign
     * @param reason - Optional reason for the assignment
     * @returns Array of assignment records
     */
    assignUsersToPlugin(pluginTenantId: string, userIds: string[], reason?: string): Promise<UserAssignmentRecord[]>;
    /**
     * Unassign a list of users from a plugin installation.
     *
     * @param pluginTenantId - The plugin tenant ID
     * @param userIds - Array of user IDs to unassign
     * @param reason - Optional reason for the unassignment
     * @returns Array of unassignment records
     */
    unassignUsersFromPlugin(pluginTenantId: string, userIds: string[], reason?: string): Promise<UserAssignmentRecord[]>;
    /**
     * Check whether a user has access to a plugin.
     *
     * @param where - Object containing pluginId, pluginTenantId, tenantId, organizationId
     * @param userId - Optional user ID (defaults to current user from context)
     * @returns True if user has access, false otherwise
     */
    hasUserAccessToPlugin(where: UserAccessCheckWhere, userId?: string): Promise<boolean>;
    /**
     * Check if a plugin is enabled for a tenant
     *
     * @param pluginId - The plugin ID
     * @param tenantId - Optional tenant ID (defaults to current)
     * @param organizationId - Optional organization ID (defaults to current)
     * @returns True if plugin is enabled, false otherwise
     */
    isPluginEnabledForTenant(pluginId: string, tenantId?: string, organizationId?: string): Promise<boolean>;
    /**
     * Get plugin tenant by plugin ID and context
     *
     * @param pluginId - The plugin ID
     * @param tenantId - Optional tenant ID (defaults to current)
     * @param organizationId - Optional organization ID (defaults to current)
     * @returns Plugin tenant or null if not found
     */
    getPluginTenantByPlugin(pluginId: string, tenantId?: string, organizationId?: string): Promise<any>;
    /**
     * Validate assignment input parameters
     *
     * @param pluginTenantId - Plugin tenant ID to validate
     * @param userIds - User IDs array to validate
     */
    private validateAssignmentInput;
    /**
     * Validate user for assignment
     *
     * @param userId - User ID to validate
     * @param pluginTenant - Plugin tenant for assignment
     */
    private validateUserForAssignment;
    /**
     * Get current user roles using the RoleService with query builder
     *
     * @param userId - User ID to get roles for
     * @returns Array of user roles
     */
    private getCurrentUserRoles;
}
