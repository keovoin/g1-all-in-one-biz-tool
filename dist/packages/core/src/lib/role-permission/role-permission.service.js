"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const underscore_1 = require("underscore");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const utils_1 = require("../core/utils");
const import_record_1 = require("./../export-import/import-record");
const role_permission_entity_1 = require("./role-permission.entity");
const role_service_1 = require("./../role/role.service");
const default_role_permissions_1 = require("./default-role-permissions");
const mikro_orm_role_permission_repository_1 = require("./repository/mikro-orm-role-permission.repository");
const type_orm_role_permission_repository_1 = require("./repository/type-orm-role-permission.repository");
let RolePermissionService = class RolePermissionService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmRolePermissionRepository, mikroOrmRolePermissionRepository, _roleService, _commandBus) {
        super(typeOrmRolePermissionRepository, mikroOrmRolePermissionRepository);
        this.typeOrmRolePermissionRepository = typeOrmRolePermissionRepository;
        this.mikroOrmRolePermissionRepository = mikroOrmRolePermissionRepository;
        this._roleService = _roleService;
        this._commandBus = _commandBus;
    }
    /**
     * Retrieves the permissions of the current user.
     *
     * @return {Promise<IPagination<RolePermission>>} A promise that resolves to a paginated list of RolePermission objects.
     */
    async findMePermissions() {
        const tenantId = context_1.RequestContext.currentTenantId();
        const roleId = context_1.RequestContext.currentRoleId();
        return await this.find({
            where: {
                role: { id: roleId, tenantId },
                tenant: { id: tenantId },
                enabled: true,
                isActive: true,
                isArchived: false
            }
        });
    }
    /**
     * GET all role-permissions using API filter
     *
     * @param filter
     * @returns
     */
    async findAllRolePermissions(filter) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const roleId = context_1.RequestContext.currentRoleId();
        /**
         * Find current user role
         */
        const role = await this._roleService.findOneByWhereOptions({
            id: roleId,
            tenantId
        });
        /**
         * If, SUPER_ADMIN users try to retrieve all role-permissions allow them.
         */
        if (role.name === contracts_1.RolesEnum.SUPER_ADMIN) {
            return await this.findAll(filter);
        }
        /**
         * Only SUPER_ADMIN/ADMIN can have `PermissionsEnum.CHANGE_ROLES_PERMISSIONS` permission
         * SUPER_ADMIN can retrieve all role-permissions for assign TENANT.
         * ADMIN can retrieve role-permissions for lower roles (DATA_ENTRY, EMPLOYEE, CANDIDATE, MANAGER, VIEWER) & them self (ADMIN)
         */
        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS)) {
            /**
             * Retrieve all role-permissions except "SUPER_ADMIN" role
             */
            const roles = (await this._roleService.findAll({
                select: ['id'],
                where: {
                    name: (0, typeorm_1.Not)(contracts_1.RolesEnum.SUPER_ADMIN),
                    tenantId
                }
            })).items;
            if (!filter.where) {
                /**
                 * GET all role-permissions for (DATA_ENTRY, EMPLOYEE, CANDIDATE, MANAGER, VIEWER) roles them self (ADMIN), if specific role filter not used in API.
                 *
                 */
                filter['where'] = {
                    roleId: (0, typeorm_1.In)((0, underscore_1.pluck)(roles, 'id')),
                    tenantId
                };
            }
            else if (filter.where && filter.where['roleId']) {
                /**
                 * If, ADMIN try to retrieve "SUPER_ADMIN" role-permissions via API filter, not allow them.
                 * Retrieve current user role (ADMIN) all role-permissions.
                 */
                if (!(0, underscore_1.pluck)(roles, 'id').includes(filter.where['roleId'])) {
                    filter['where'] = {
                        roleId,
                        tenantId
                    };
                }
            }
            return await this.findAll(filter);
        }
        /**
         * If (DATA_ENTRY, EMPLOYEE, CANDIDATE, MANAGER, VIEWER) roles users try to retrieve role-permissions.
         * Allow only to retrieve current users role-permissions.
         */
        filter['where'] = {
            roleId,
            tenantId
        };
        return await this.findAll(filter);
    }
    /**
     * Create permissions for lower roles users
     *
     * @param partialEntity
     * @returns
     */
    async createPermission(partialEntity) {
        try {
            const currentTenantId = context_1.RequestContext.currentTenantId();
            const currentRoleId = context_1.RequestContext.currentRoleId();
            /**
             * Find current user role
             */
            const role = await this._roleService.findOneByWhereOptions({
                id: currentRoleId,
                tenantId: currentTenantId
            });
            // The target role may arrive as `roleId` or as a plain `role` object (the role object in the DTO is never a
            // Role instance after class-transformer). Resolve it fail-closed: an undefined id used to be
            // dropped from the lookup and returned the FIRST role of the tenant, whose name is what the
            // SUPER_ADMIN / ADMIN checks below inspect.
            const roleId = partialEntity.roleId ?? partialEntity['role']?.['id'];
            if (!roleId) {
                throw new common_1.BadRequestException('roleId is required');
            }
            /**
             * User try to create permission for below role
             */
            const wantToCreatePermissionForRole = await this._roleService.findOneByIdString(roleId);
            /**
             * If current user has SUPER_ADMIN
             */
            if (role.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                /**
                 * Reject request, if SUPER ADMIN try to create permissions for SUPER ADMIN role.
                 */
                if (wantToCreatePermissionForRole.name === contracts_1.RolesEnum.SUPER_ADMIN ||
                    !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS)) {
                    throw new common_1.NotAcceptableException('You can not change/add your permissions for SUPER_ADMIN');
                }
                return await this.create(partialEntity);
            }
            else if (role.name === contracts_1.RolesEnum.ADMIN) {
                /**
                 * Reject request, if ADMIN try to create permissions for SUPER ADMIN role.
                 */
                if (wantToCreatePermissionForRole.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                    throw new common_1.NotAcceptableException('You can not change your role to SUPER_ADMIN, please ask your SUPER_ADMIN to give you more permissions');
                }
                /**
                 * Reject request, if ADMIN try to create permissions for ADMIN role.
                 */
                if (wantToCreatePermissionForRole.name === contracts_1.RolesEnum.ADMIN ||
                    !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS)) {
                    throw new common_1.NotAcceptableException('You can not change/add your permissions to ADMIN, please ask your SUPER_ADMIN to give you more permissions');
                }
                return await this.create(partialEntity);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updatePermission(id, partialEntity) {
        try {
            const currentTenantId = context_1.RequestContext.currentTenantId();
            const currentRoleId = context_1.RequestContext.currentRoleId();
            /**
             * Find current user role
             */
            const role = await this._roleService.findOneByWhereOptions({
                id: currentRoleId,
                tenantId: currentTenantId
            });
            // The target role may arrive as `roleId` or as a plain `role` object (the role object in the DTO is never a
            // Role instance after class-transformer). Resolve it fail-closed: an undefined id used to be
            // dropped from the lookup and returned the FIRST role of the tenant, whose name is what the
            // SUPER_ADMIN / ADMIN checks below inspect.
            const roleId = partialEntity.roleId ?? partialEntity['role']?.['id'];
            if (!roleId) {
                throw new common_1.BadRequestException('roleId is required');
            }
            /**
             * User try to update permission for below role
             */
            const wantToUpdatePermissionForRole = await this._roleService.findOneByIdString(roleId);
            if (role.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                /**
                 * Reject request, if SUPER ADMIN try to update permissions for SUPER ADMIN role.
                 */
                if (wantToUpdatePermissionForRole.name === contracts_1.RolesEnum.SUPER_ADMIN ||
                    !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS)) {
                    throw new common_1.NotAcceptableException('You can not change/add your permissions for SUPER_ADMIN');
                }
                return await this.update(id, partialEntity);
            }
            else if (role.name === contracts_1.RolesEnum.ADMIN) {
                /**
                 * Reject request, if ADMIN try to update permissions for SUPER ADMIN role.
                 */
                if (wantToUpdatePermissionForRole.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                    throw new common_1.NotAcceptableException('You can not change your role to SUPER_ADMIN, please ask your SUPER_ADMIN to give you more permissions');
                }
                /**
                 * Reject request, if ADMIN try to create permissions for ADMIN role.
                 */
                if (wantToUpdatePermissionForRole.name === contracts_1.RolesEnum.ADMIN ||
                    !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS)) {
                    throw new common_1.NotAcceptableException('You can not change/add your permissions to ADMIN, please ask your SUPER_ADMIN to give you more permissions');
                }
                return await this.update(id, partialEntity);
            }
        }
        catch (err /*: WriteError*/) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    /**
     * DELETE role permissions
     *
     * @param id
     * @returns
     */
    async deletePermission(id) {
        try {
            const currentTenantId = context_1.RequestContext.currentTenantId();
            const currentRoleId = context_1.RequestContext.currentRoleId();
            /**
             * Find current user role
             */
            const role = await this._roleService.findOneByWhereOptions({
                id: currentRoleId,
                tenantId: currentTenantId
            });
            /**
             * User try to delete permission for below role
             */
            const permRecord = await this.findOneByOptions({
                where: { id },
                relations: { role: true }
            });
            const wantToDeletePermissionForRole = permRecord?.role;
            if (role.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                /**
                 * Reject request, if SUPER ADMIN try to delete permissions for SUPER ADMIN role.
                 */
                if (wantToDeletePermissionForRole.name === contracts_1.RolesEnum.SUPER_ADMIN ||
                    !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS)) {
                    throw new common_1.NotAcceptableException('You can not delete your permissions to SUPER_ADMIN');
                }
                return await this.delete(id);
            }
            else if (role.name === contracts_1.RolesEnum.ADMIN) {
                /**
                 * Reject request, if ADMIN try to update permissions for SUPER ADMIN role.
                 */
                if (wantToDeletePermissionForRole.name === contracts_1.RolesEnum.SUPER_ADMIN) {
                    throw new common_1.NotAcceptableException('You can not delete SUPER_ADMIN permission, please ask your SUPER_ADMIN to give you more permissions');
                }
                /**
                 * Reject request, if ADMIN try to create permissions for ADMIN role.
                 */
                if (wantToDeletePermissionForRole.name === contracts_1.RolesEnum.ADMIN ||
                    !context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS)) {
                    throw new common_1.NotAcceptableException('You can not delete your permissions to ADMIN, please ask your SUPER_ADMIN to give you more permissions');
                }
                return await this.delete(id);
            }
        }
        catch (error /*: WriteError*/) {
            throw new common_1.BadRequestException(error);
        }
    }
    async updateRoles(tenant, role) {
        const { defaultEnabledPermissions } = default_role_permissions_1.DEFAULT_ROLE_PERMISSIONS.find((defaultRole) => role.name === defaultRole.role);
        const rolePermissions = defaultEnabledPermissions.map((permission) => {
            const rolePermission = new role_permission_entity_1.RolePermission();
            rolePermission.roleId = role.id;
            rolePermission.permission = permission;
            rolePermission.enabled = true;
            rolePermission.tenant = tenant;
            return rolePermission;
        });
        await this.createMany(rolePermissions);
    }
    async updateRolesAndPermissions(tenants) {
        if (!tenants.length) {
            return;
        }
        // removed permissions for all users in DEMO mode
        const deniedPermissions = [contracts_1.PermissionsEnum.ACCESS_DELETE_ACCOUNT, contracts_1.PermissionsEnum.ACCESS_DELETE_ALL_DATA];
        const rolesPermissions = [];
        for await (const tenant of tenants) {
            const roles = (await this._roleService.findAll({
                where: {
                    tenantId: tenant.id
                }
            })).items;
            for await (const role of roles) {
                const defaultPermissions = default_role_permissions_1.DEFAULT_ROLE_PERMISSIONS.find((defaultRole) => role.name === defaultRole.role);
                const permissions = Object.values(contracts_1.PermissionsEnum).filter((permission) => config_1.environment.demo ? !deniedPermissions.includes(permission) : true);
                for await (const permission of permissions) {
                    if (defaultPermissions) {
                        const { defaultEnabledPermissions = [] } = defaultPermissions;
                        const rolePermission = new role_permission_entity_1.RolePermission();
                        rolePermission.roleId = role.id;
                        rolePermission.permission = permission;
                        rolePermission.enabled = defaultEnabledPermissions.includes(permission);
                        rolePermission.tenant = tenant;
                        rolesPermissions.push(rolePermission);
                    }
                }
            }
        }
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmRepository.getEntityManager();
                rolesPermissions.forEach((rp) => em.persist(rp));
                await em.flush();
                break;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default:
                await this.typeOrmRepository.save(rolesPermissions);
                break;
        }
        return rolesPermissions;
    }
    async migratePermissions() {
        const permissions = await this.find({
            where: {
                tenantId: context_1.RequestContext.currentTenantId()
            },
            relations: {
                role: true
            }
        });
        const payload = [];
        for await (const item of permissions) {
            const { id: sourceId, permission, role: { name }, description } = item;
            payload.push({
                permission,
                description,
                isImporting: true,
                sourceId,
                role: name
            });
        }
        return payload;
    }
    async migrateImportRecord(permissions) {
        let records = [];
        const roles = (await this._roleService.findAll({
            where: {
                tenantId: context_1.RequestContext.currentTenantId()
            }
        })).items;
        for await (const item of permissions) {
            const { isImporting, sourceId } = item;
            if (isImporting && sourceId) {
                const { permission, role: name } = item;
                const role = roles.find((role) => role.name === name);
                const destination = await this.findOneByWhereOptions({
                    tenantId: context_1.RequestContext.currentTenantId(),
                    permission,
                    roleId: role.id
                });
                if (destination) {
                    records.push(await this._commandBus.execute(new import_record_1.ImportRecordUpdateOrCreateCommand({
                        entityType: this.tableName,
                        sourceId,
                        destinationId: destination.id,
                        tenantId: context_1.RequestContext.currentTenantId()
                    })));
                }
            }
        }
        return records;
    }
    /**
     * Checks if the given role permissions are valid for the current tenant.
     * @param permissions - An array of role permissions to check.
     * @param includeRole - Optional parameter to include role-specific checks.
     * @returns A Promise with a boolean indicating if the role permissions are valid.
     * @throws Error if the ORM type is not implemented.
     */
    async checkRolePermission(tenantId, roleId, permissions, includeRole = false) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.TypeORM:
                // Create a query builder for the 'role_permission' entity
                const query = this.typeOrmRepository.createQueryBuilder('rp');
                // Add the condition for the current tenant ID
                query.where('rp.tenantId = :tenantId', { tenantId });
                // If includeRole is true, add the condition for the current role ID
                if (includeRole) {
                    query.andWhere('rp.roleId = :roleId', { roleId });
                }
                // Add conditions for permissions, enabled, isActive, and isArchived
                query.andWhere('rp.permission IN (:...permissions)', { permissions });
                query.andWhere('rp.enabled = :enabled', { enabled: true });
                query.andWhere('rp.isActive = :isActive', { isActive: true });
                query.andWhere('rp.isArchived = :isArchived', { isArchived: false });
                // Execute the query and get the count
                const count = await query.getCount();
                // Return true if the count is greater than 0, indicating valid permissions
                return count > 0;
            // MikroORM implementation
            case utils_1.MultiORMEnum.MikroORM:
                // Create a query builder for the 'RolePermission' entity
                const totalCount = await this.mikroOrmRepository.count({
                    tenantId,
                    ...(includeRole ? { roleId } : {}),
                    permission: { $in: [...permissions] },
                    enabled: true,
                    isActive: true,
                    isArchived: false
                });
                // Return true if the count is greater than 0, indicating valid permissions
                return totalCount > 0;
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
};
exports.RolePermissionService = RolePermissionService;
exports.RolePermissionService = RolePermissionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_role_permission_repository_1.TypeOrmRolePermissionRepository,
        mikro_orm_role_permission_repository_1.MikroOrmRolePermissionRepository,
        role_service_1.RoleService,
        cqrs_1.CommandBus])
], RolePermissionService);
//# sourceMappingURL=role-permission.service.js.map