import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { PermissionGuard } from './permission.guard';
import { ManagedEmployeeService } from '../../employee/managed-employee.service';
import { RolePermissionService } from '../../role-permission/role-permission.service';
/**
 * Guard that allows access if the user is either:
 * 1. A manager of the teams/projects specified in the request, OR
 * 2. Has the required permissions
 *
 * This guard checks if the current user is a manager of the teams or projects
 * specified in the request query/body parameters. If they are a manager,
 * access is granted without checking permissions.
 *
 * Usage:
 * @UseGuards(TenantPermissionGuard, ManagerOrPermissionGuard)
 * @Permissions(PermissionsEnum.ALL_ORG_EDIT)
 */
export declare class ManagerOrPermissionGuard extends PermissionGuard {
    protected _cacheManager: Cache;
    protected readonly _reflector: Reflector;
    protected readonly _rolePermissionService: RolePermissionService;
    private readonly _managedEmployeeService;
    constructor(_cacheManager: Cache, _reflector: Reflector, _rolePermissionService: RolePermissionService, _managedEmployeeService: ManagedEmployeeService);
    /**
     * Determines if the current user can activate the route.
     *
     * @param context - The execution context
     * @returns True if user is a manager of specified teams/projects OR has required permissions
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
    /**
     * Extracts IDs from request query or body.
     * Handles both array and single value cases.
     *
     * @param request - The HTTP request
     * @param arrayKey - The key for array values (e.g., 'teamIds')
     * @param singleKey - The key for single values (e.g., 'organizationTeamId')
     * @returns Array of IDs
     */
    private extractIds;
}
