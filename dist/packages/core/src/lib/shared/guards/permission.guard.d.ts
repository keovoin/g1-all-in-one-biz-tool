import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { BaseGuard } from './base.guard';
import { RolePermissionService } from '../../role-permission/role-permission.service';
export declare class PermissionGuard extends BaseGuard implements CanActivate {
    protected _cacheManager: Cache;
    protected readonly _reflector: Reflector;
    protected readonly _rolePermissionService: RolePermissionService;
    constructor(_cacheManager: Cache, _reflector: Reflector, _rolePermissionService: RolePermissionService);
    /**
     * Checks if the user is authorized based on specified permissions.
     * @param context The execution context.
     * @returns A promise that resolves to a boolean indicating authorization status.
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
}
