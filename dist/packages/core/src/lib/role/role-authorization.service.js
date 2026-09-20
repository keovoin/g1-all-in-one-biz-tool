"use strict";
var RoleAuthorizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAuthorizationService = void 0;
const tslib_1 = require("tslib");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const utils_1 = require("../core/utils");
const mikro_orm_role_repository_1 = require("./repository/mikro-orm-role.repository");
const type_orm_role_repository_1 = require("./repository/type-orm-role.repository");
/**
 * Resolves the role name and the enabled permissions of a role from the DATABASE.
 *
 * Why this exists: the access token embeds a `role` name and a `permissions` array at issuance time
 * (`AuthService.getJwtAccessToken`). Reading those claims back to make an authorization decision means
 * authorizing against state that can be up to one token lifetime (24h by default) out of date — a user
 * demoted from SUPER_ADMIN kept deleting tenants until their token expired (GHSA-m8xc-8pwr-89fj).
 *
 * `JwtStrategy` therefore calls this once per request, while it is already loading the user, and pins
 * the result onto `request.user`; every `RequestContext.hasRoles/hasPermissions/hasAnyPermission` call
 * during that request then reads the attached state instead of the token. The lookup is keyed on the
 * user's CURRENT `roleId`, so a role change takes effect on the very next request. Only the
 * role -> permission-set mapping is cached (briefly), which is exactly the part that does not change
 * when a user is demoted.
 */
let RoleAuthorizationService = RoleAuthorizationService_1 = class RoleAuthorizationService {
    constructor(typeOrmRoleRepository, mikroOrmRoleRepository, cacheManager) {
        this.typeOrmRoleRepository = typeOrmRoleRepository;
        this.mikroOrmRoleRepository = mikroOrmRoleRepository;
        this.cacheManager = cacheManager;
        this.ormType = (0, utils_1.getORMType)();
        this.logger = new common_1.Logger(RoleAuthorizationService_1.name);
    }
    /**
     * Loads the current name and enabled permissions of a role.
     *
     * @param roleId The role to resolve. A missing id resolves to `null` — fail closed, never to a
     *               permissive default.
     * @returns The role's authorization state, or `null` when it cannot be resolved.
     */
    async getAuthorizationState(roleId) {
        // No role id means no verdict can be reached. Returning null (rather than an empty-but-present
        // state) keeps every caller on the fail-closed path.
        if (!roleId) {
            return null;
        }
        const cacheKey = `${RoleAuthorizationService_1.CACHE_KEY_PREFIX}${roleId}`;
        try {
            const cached = await this.cacheManager?.get(cacheKey);
            if (cached) {
                return cached;
            }
        }
        catch (error) {
            // A cache outage must not take authorization down with it; fall through to the database.
            this.logger.warn(`Could not read the role authorization state from cache: ${error?.message}`);
        }
        const role = await this.findRoleWithPermissions(roleId);
        if (!role) {
            return null;
        }
        const state = {
            role: { id: role.id, name: role.name, tenantId: role.tenantId },
            // Same predicate `RolePermissionService.checkRolePermission` applies in SQL, so a permission
            // attached to `request.user` is one `PermissionGuard` would also grant.
            permissions: (role.rolePermissions ?? [])
                .filter((rp) => rp.enabled === true && rp.isActive === true && rp.isArchived === false)
                .map((rp) => rp.permission)
        };
        try {
            await this.cacheManager?.set(cacheKey, state, RoleAuthorizationService_1.CACHE_TTL_MS);
        }
        catch (error) {
            this.logger.warn(`Could not cache the role authorization state: ${error?.message}`);
        }
        return state;
    }
    /**
     * Pins the database-fresh role and permissions of a user onto the object that is about to become
     * `request.user`.
     *
     * When the role cannot be resolved the user is left WITHOUT a role and WITHOUT permissions, so
     * every subsequent check denies rather than falling back to whatever the token claimed.
     *
     * @param user The authenticated user.
     * @returns The same user instance, with `role` and `permissions` set.
     */
    async attachAuthorizationState(user) {
        if (!user) {
            return user;
        }
        const state = await this.getAuthorizationState(user.roleId);
        if (state) {
            user.role = state.role;
            user.permissions = state.permissions;
        }
        else {
            // Do not leave behind a role the caller brought with them (an eagerly loaded relation, or a
            // value set earlier in the request): `RequestContext.hasRoles()` reads `user.role`, so a role
            // kept here would still authorize a user whose role no longer resolves.
            delete user.role;
            user.permissions = [];
        }
        return user;
    }
    /**
     * Reads the role together with its role permissions, on either ORM.
     *
     * @param roleId The role to load.
     * @returns The role with its `rolePermissions`, or null when it does not exist.
     */
    async findRoleWithPermissions(roleId) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const { where, mikroOptions } = (0, utils_1.parseTypeORMFindToMikroOrm)({
                    where: { id: roleId },
                    relations: { rolePermissions: true }
                });
                return (await this.mikroOrmRoleRepository.findOne(where, mikroOptions));
            }
            case utils_1.MultiORMEnum.TypeORM:
                return await this.typeOrmRoleRepository.findOne({
                    where: { id: roleId },
                    relations: { rolePermissions: true }
                });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
};
exports.RoleAuthorizationService = RoleAuthorizationService;
/** Cache key prefix for the per-role authorization state. */
RoleAuthorizationService.CACHE_KEY_PREFIX = 'authz_role_state_';
/**
 * Kept short on purpose. A demotion is reflected immediately (the key is the user's current
 * roleId), so this TTL only bounds how long an edit to a ROLE's permission set can linger — and
 * it is shorter than the 5 minute caches `PermissionGuard` / `TenantPermissionGuard` already use.
 */
RoleAuthorizationService.CACHE_TTL_MS = 60 * 1000;
exports.RoleAuthorizationService = RoleAuthorizationService = RoleAuthorizationService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [type_orm_role_repository_1.TypeOrmRoleRepository,
        mikro_orm_role_repository_1.MikroOrmRoleRepository, Object])
], RoleAuthorizationService);
//# sourceMappingURL=role-authorization.service.js.map