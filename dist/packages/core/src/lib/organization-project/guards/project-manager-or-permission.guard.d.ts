import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';
import { PermissionGuard } from '../../shared/guards';
import { RolePermissionService } from '../../role-permission/role-permission.service';
import { OrganizationProjectService } from '../organization-project.service';
export declare class ProjectManagerOrPermissionGuard extends PermissionGuard implements CanActivate {
    readonly _reflector: Reflector;
    readonly _rolePermissionService: RolePermissionService;
    readonly _projectService: OrganizationProjectService;
    constructor(_cacheManager: Cache, _reflector: Reflector, _rolePermissionService: RolePermissionService, _projectService: OrganizationProjectService);
    /**
     * Determines if the current user has access to the project.
     * @param context - The execution context of the request.
     * @returns A boolean indicating whether the user can proceed.
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
}
