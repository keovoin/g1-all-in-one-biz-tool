"use strict";
var PluginUserAssignmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginUserAssignmentService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_tenant_service_1 = require("./plugin-tenant.service");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, core_1.getORMType)();
/**
 * Service for managing plugin user assignments
 * Uses PluginTenantService to handle plugin access control and user assignments
 */
let PluginUserAssignmentService = PluginUserAssignmentService_1 = class PluginUserAssignmentService {
    constructor(pluginTenantService, roleService) {
        this.pluginTenantService = pluginTenantService;
        this.roleService = roleService;
        this.logger = new common_1.Logger(PluginUserAssignmentService_1.name);
    }
    /**
     * Assign a list of users to a plugin installation.
     * This method manages user access through the plugin tenant configuration.
     *
     * @param pluginTenantId - The plugin tenant ID (not installation ID for compatibility)
     * @param userIds - Array of user IDs to assign
     * @param reason - Optional reason for the assignment
     * @returns Array of assignment records
     */
    async assignUsersToPlugin(pluginTenantId, userIds, reason) {
        this.validateAssignmentInput(pluginTenantId, userIds);
        try {
            // Get the plugin tenant to verify it exists and is enabled
            const pluginTenant = await this.pluginTenantService.findOneByIdString(pluginTenantId);
            if (!pluginTenant) {
                throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
            }
            if (!pluginTenant.isAvailable()) {
                throw new common_1.BadRequestException(`Plugin tenant "${pluginTenantId}" is not available for assignment`);
            }
            // Check if we can add more users based on quota
            const newUserCount = userIds.length;
            const currentUsers = pluginTenant.currentActiveUsers || 0;
            const maxUsers = pluginTenant.maxActiveUsers;
            if (maxUsers !== null && maxUsers !== undefined && maxUsers !== -1) {
                if (currentUsers + newUserCount > maxUsers) {
                    throw new common_1.BadRequestException(`Cannot assign ${newUserCount} users. Would exceed maximum limit of ${maxUsers} users. Currently ${currentUsers} users assigned.`);
                }
            }
            // Create assignment records
            const assignments = [];
            const assignmentTime = new Date();
            for (const userId of userIds) {
                // Validate user exists and can be assigned
                await this.validateUserForAssignment(userId, pluginTenant);
                const assignment = {
                    pluginTenantId,
                    userId,
                    reason,
                    assignedAt: assignmentTime,
                    status: 'assigned'
                };
                assignments.push(assignment);
            }
            // Update the current active users count
            await this.pluginTenantService.update(pluginTenantId, {
                currentActiveUsers: currentUsers + newUserCount
            });
            this.logger.log(`Assigned ${userIds.length} users to plugin tenant: ${pluginTenantId}`);
            return assignments;
        }
        catch (error) {
            this.logger.error(`Failed to assign users to plugin tenant ${pluginTenantId}`, error);
            throw error;
        }
    }
    /**
     * Unassign a list of users from a plugin installation.
     *
     * @param pluginTenantId - The plugin tenant ID
     * @param userIds - Array of user IDs to unassign
     * @param reason - Optional reason for the unassignment
     * @returns Array of unassignment records
     */
    async unassignUsersFromPlugin(pluginTenantId, userIds, reason) {
        this.validateAssignmentInput(pluginTenantId, userIds);
        try {
            // Get the plugin tenant to verify it exists
            const pluginTenant = await this.pluginTenantService.findOneByIdString(pluginTenantId);
            if (!pluginTenant) {
                throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
            }
            // Create unassignment records
            const unassignments = [];
            const unassignmentTime = new Date();
            for (const userId of userIds) {
                const unassignment = {
                    pluginTenantId,
                    userId,
                    reason,
                    assignedAt: new Date(0), // Historical assignment date (unknown)
                    unassignedAt: unassignmentTime,
                    status: 'unassigned'
                };
                unassignments.push(unassignment);
            }
            // Update the current active users count (safely prevent negative values)
            const currentUsers = pluginTenant.currentActiveUsers || 0;
            const newUserCount = Math.max(currentUsers - userIds.length, 0);
            await this.pluginTenantService.update(pluginTenantId, {
                currentActiveUsers: newUserCount
            });
            this.logger.log(`Unassigned ${userIds.length} users from plugin tenant: ${pluginTenantId}`);
            return unassignments;
        }
        catch (error) {
            this.logger.error(`Failed to unassign users from plugin tenant ${pluginTenantId}`, error);
            throw error;
        }
    }
    /**
     * Check whether a user has access to a plugin.
     *
     * @param where - Object containing pluginId, pluginTenantId, tenantId, organizationId
     * @param userId - Optional user ID (defaults to current user from context)
     * @returns True if user has access, false otherwise
     */
    async hasUserAccessToPlugin(where, userId) {
        try {
            // Get current user ID if not provided
            const currentUserId = userId || core_1.RequestContext.currentUserId();
            if (!currentUserId) {
                this.logger.debug('No user ID provided and no current user in context');
                return false;
            }
            // Get tenant and organization IDs from context if not provided
            const tenantId = where.tenantId || core_1.RequestContext.currentTenantId();
            const organizationId = where.organizationId || core_1.RequestContext.currentOrganizationId();
            if (!tenantId) {
                this.logger.debug('No tenant ID available for access check');
                return false;
            }
            let pluginTenant;
            if (where.pluginTenantId) {
                // Direct lookup by plugin tenant ID
                pluginTenant = await this.pluginTenantService.findOneByIdString(where.pluginTenantId);
            }
            else if (where.pluginId) {
                // Lookup by plugin ID and tenant/organization
                pluginTenant = await this.pluginTenantService.findByPluginAndTenant(where.pluginId, tenantId, organizationId);
            }
            else {
                this.logger.debug('Neither pluginTenantId nor pluginId provided in where clause');
                return false;
            }
            if (!pluginTenant) {
                this.logger.debug(`No plugin tenant found for access check`);
                return false;
            }
            // Check if plugin is available
            if (!pluginTenant.isAvailable()) {
                this.logger.debug(`Plugin tenant ${pluginTenant.id} is not available`);
                return false;
            }
            // Get user roles for access check
            const userRoles = await this.getCurrentUserRoles(currentUserId);
            // Use the plugin tenant's built-in access control logic
            const hasAccess = pluginTenant.hasUserAccess(currentUserId, userRoles);
            this.logger.debug(`User ${currentUserId} access to plugin tenant ${pluginTenant.id}: ${hasAccess}`);
            return hasAccess;
        }
        catch (error) {
            this.logger.error('Error checking user access to plugin', error);
            return false;
        }
    }
    /**
     * Check if a plugin is enabled for a tenant
     *
     * @param pluginId - The plugin ID
     * @param tenantId - Optional tenant ID (defaults to current)
     * @param organizationId - Optional organization ID (defaults to current)
     * @returns True if plugin is enabled, false otherwise
     */
    async isPluginEnabledForTenant(pluginId, tenantId, organizationId) {
        try {
            const currentTenantId = tenantId || core_1.RequestContext.currentTenantId();
            const currentOrgId = organizationId || core_1.RequestContext.currentOrganizationId();
            if (!currentTenantId) {
                return false;
            }
            return await this.pluginTenantService.isPluginEnabled(pluginId, currentTenantId, currentOrgId);
        }
        catch (error) {
            this.logger.error(`Error checking if plugin ${pluginId} is enabled for tenant`, error);
            return false;
        }
    }
    /**
     * Get plugin tenant by plugin ID and context
     *
     * @param pluginId - The plugin ID
     * @param tenantId - Optional tenant ID (defaults to current)
     * @param organizationId - Optional organization ID (defaults to current)
     * @returns Plugin tenant or null if not found
     */
    async getPluginTenantByPlugin(pluginId, tenantId, organizationId) {
        try {
            const currentTenantId = tenantId || core_1.RequestContext.currentTenantId();
            const currentOrgId = organizationId || core_1.RequestContext.currentOrganizationId();
            if (!currentTenantId) {
                return null;
            }
            return await this.pluginTenantService.findByPluginAndTenant(pluginId, currentTenantId, currentOrgId);
        }
        catch (error) {
            this.logger.error(`Error getting plugin tenant for plugin ${pluginId}`, error);
            return null;
        }
    }
    /**
     * Validate assignment input parameters
     *
     * @param pluginTenantId - Plugin tenant ID to validate
     * @param userIds - User IDs array to validate
     */
    validateAssignmentInput(pluginTenantId, userIds) {
        if (!pluginTenantId || pluginTenantId.trim().length === 0) {
            throw new common_1.BadRequestException('Plugin tenant ID is required and cannot be empty');
        }
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            throw new common_1.BadRequestException('User IDs array is required and cannot be empty');
        }
        // Validate each user ID
        for (const userId of userIds) {
            if (!userId || userId.trim().length === 0) {
                throw new common_1.BadRequestException('All user IDs must be valid and non-empty');
            }
        }
        // Check for duplicates
        const uniqueUserIds = new Set(userIds);
        if (uniqueUserIds.size !== userIds.length) {
            throw new common_1.BadRequestException('Duplicate user IDs are not allowed');
        }
    }
    /**
     * Validate user for assignment
     *
     * @param userId - User ID to validate
     * @param pluginTenant - Plugin tenant for assignment
     */
    async validateUserForAssignment(userId, pluginTenant) {
        // Additional validation logic can be added here
        // For now, we'll do basic validation
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        // Check if user is explicitly denied
        if (pluginTenant.deniedUsers?.some((user) => user.id === userId)) {
            throw new common_1.BadRequestException(`User ${userId} is explicitly denied access to this plugin`);
        }
    }
    /**
     * Get current user roles using the RoleService with query builder
     *
     * @param userId - User ID to get roles for
     * @returns Array of user roles
     */
    async getCurrentUserRoles(userId) {
        try {
            if (!userId) {
                this.logger.debug('No user ID provided for role lookup');
                return [];
            }
            // Get tenant and organization context
            const tenantId = core_1.RequestContext.currentTenantId();
            const organizationId = core_1.RequestContext.currentOrganizationId();
            if (!tenantId) {
                this.logger.debug('No tenant context available for role lookup');
                return [];
            }
            switch (ormType) {
                case core_1.MultiORMEnum.MikroORM: {
                    // MikroORM: Use roleService's ORM-agnostic findAll through the base service
                    const result = await this.roleService.findAll({
                        where: {
                            tenantId,
                            isActive: true,
                            isArchived: false,
                            ...(organizationId ? { organizationId } : {}),
                            users: { id: userId }
                        },
                        order: { name: 'ASC' }
                    });
                    const roles = result.items || [];
                    this.logger.debug(`Found ${roles.length} active roles for user ${userId} in tenant ${tenantId}${organizationId ? ` and organization ${organizationId}` : ''}`);
                    return roles;
                }
                case core_1.MultiORMEnum.TypeORM:
                default: {
                    // Use query builder for more efficient and flexible query
                    const query = this.roleService
                        .createQueryBuilder('role')
                        .innerJoin('role.users', 'user')
                        .where('user.id = :userId', { userId })
                        .andWhere('role.tenantId = :tenantId', { tenantId })
                        .andWhere('role.isActive = :isActive', { isActive: true })
                        .andWhere('role.isArchived = :isArchived', { isArchived: false });
                    // Add organization filter if available
                    if (organizationId) {
                        query.andWhere('role.organizationId = :organizationId', { organizationId });
                    }
                    // Order by role name for consistent results
                    query.orderBy('role.name', 'ASC');
                    const roles = await query.getMany();
                    this.logger.debug(`Found ${roles.length} active roles for user ${userId} in tenant ${tenantId}${organizationId ? ` and organization ${organizationId}` : ''}`);
                    return roles;
                }
            }
        }
        catch (error) {
            return [];
        }
    }
};
exports.PluginUserAssignmentService = PluginUserAssignmentService;
exports.PluginUserAssignmentService = PluginUserAssignmentService = PluginUserAssignmentService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [plugin_tenant_service_1.PluginTenantService, core_1.RoleService])
], PluginUserAssignmentService);
//# sourceMappingURL=plugin-user-assignment.service.js.map