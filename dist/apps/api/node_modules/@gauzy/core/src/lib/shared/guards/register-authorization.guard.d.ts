import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ID, IRole, PermissionsEnum } from '@gauzy/contracts';
import { TypeOrmRoleRepository } from '../../role/repository/type-orm-role.repository';
import { MikroOrmRoleRepository } from '../../role/repository/mikro-orm-role.repository';
import { RoleAuthorizationService } from '../../role/role-authorization.service';
import { TypeOrmOrganizationRepository } from '../../organization/repository/type-orm-organization.repository';
import { MikroOrmOrganizationRepository } from '../../organization/repository/mikro-orm-organization.repository';
/**
 * Minimal user shape set on the request by this guard when the register route
 * is called with privileged fields by an authenticated admin. Ensures
 * RequestContext.currentTenantId() and related helpers are available for the rest of the request.
 */
export interface RegisterRequestUser {
    id: ID;
    tenantId: ID;
    roleId?: ID;
    /** The role the caller holds in the DATABASE, not the one their token claims. */
    role?: IRole;
    /** Enabled permissions of that role, so RequestContext.hasPermission() is answerable downstream. */
    permissions?: PermissionsEnum[];
}
/**
 * Guard that protects the public registration endpoint
 *
 * The `/api/auth/register` endpoint is @Public() (no global AuthGuard).
 * This guard inspects the request body:
 *  - If no privileged fields are present → pure public registration → allow through.
 *  - If privileged fields are present → require a valid JWT whose user is, in the database, an
 *    active ADMIN/SUPER_ADMIN, and verify tenant isolation for any supplied roleId or organizationId.
 */
export declare class RegisterAuthorizationGuard implements CanActivate {
    private readonly typeOrmRoleRepository;
    private readonly mikroOrmRoleRepository;
    private readonly typeOrmOrganizationRepository;
    private readonly mikroOrmOrganizationRepository;
    private readonly roleAuthorizationService;
    private readonly moduleRef;
    constructor(typeOrmRoleRepository: TypeOrmRoleRepository, mikroOrmRoleRepository: MikroOrmRoleRepository, typeOrmOrganizationRepository: TypeOrmOrganizationRepository, mikroOrmOrganizationRepository: MikroOrmOrganizationRepository, roleAuthorizationService: RoleAuthorizationService, moduleRef: ModuleRef);
    /**
     * Loads the caller named by the token from the database.
     *
     * The user repository is resolved when the guard RUNS, not when this file is loaded. This file sits
     * on the User entity's own module-initialization chain — `user.entity` -> `core/entities/internal`
     * -> `import-history.subscriber` -> `core/file-storage` -> `tenant-setting.module` ->
     * `role-permission.module` -> `role-permission.controller` -> `shared/guards` -> here — so a
     * top-level import of anything under `user/` closes that cycle: the user repository is then
     * evaluated while `user.entity` is still being initialized, `@InjectRepository(User)` receives
     * `undefined`, and Nest fails with "A circular dependency has been detected inside
     * @InjectRepository()". Deferring the import keeps the cycle open.
     *
     * @param id The user id carried by the token.
     * @returns The user row, or null when it does not exist.
     */
    private findCaller;
    /**
     * Checks if the request is authorized to proceed.
     *
     * @param context The execution context.
     * @returns A promise that resolves to a boolean indicating whether the request is authorized.
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
}
