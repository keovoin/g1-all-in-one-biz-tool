"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPermissionGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const constants_1 = require("@gauzy/constants");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const context_1 = require("./../../core/context");
const tenant_base_guard_1 = require("./tenant-base.guard");
const role_permission_service_1 = require("../../role-permission/role-permission.service");
let TenantPermissionGuard = class TenantPermissionGuard extends tenant_base_guard_1.TenantBaseGuard {
    constructor(cacheManager, _reflector, _rolePermissionService) {
        super();
        this.cacheManager = cacheManager;
        this._reflector = _reflector;
        this._rolePermissionService = _rolePermissionService;
    }
    /**
     *
     * @param context
     * @returns
     */
    async canActivate(context) {
        console.log('TenantPermissionGuard canActivate called');
        // Check if the route or controller has the PUBLIC decorator
        const isPublic = this._reflector.get(constants_1.PUBLIC_METHOD_METADATA, context.getHandler()) ||
            this._reflector.get(constants_1.PUBLIC_METHOD_METADATA, context.getClass());
        // Allow access if the method or class has the PUBLIC decorator
        if (isPublic) {
            return true;
        }
        const tenantId = context_1.RequestContext.currentTenantId();
        const roleId = context_1.RequestContext.currentRoleId();
        let isAuthorized = false;
        if (!tenantId) {
            return isAuthorized;
        }
        // Check if the guard allows access based on the parent class's canActivate method
        isAuthorized = await super.canActivate(context);
        // If the guard disallows access, return early
        if (!isAuthorized) {
            return isAuthorized;
        }
        // Check for super admin role
        if (config_1.environment.allowSuperAdminRole && context_1.RequestContext.hasRoles([contracts_1.RolesEnum.SUPER_ADMIN])) {
            return true;
        }
        // Retrieve permissions from metadata
        const targets = [context.getHandler(), context.getClass()];
        const permissions = (0, utils_1.deduplicate)(this._reflector.getAllAndOverride(constants_1.PERMISSIONS_METADATA, targets)) || [];
        // Check if permissions are not empty
        if ((0, utils_1.isNotEmpty)(permissions)) {
            const cacheKey = `tenantPermissions_${tenantId}_${roleId}_${permissions.join('_')}`;
            console.log('Checking Tenant Permissions from Cache with key:', cacheKey);
            const fromCache = await this.cacheManager.get(cacheKey);
            if (fromCache == null) {
                console.log('Tenant Permissions NOT loaded from Cache with key:', cacheKey);
                // Check if the tenant has the required permissions
                isAuthorized = await this._rolePermissionService.checkRolePermission(tenantId, roleId, permissions);
                await this.cacheManager.set(cacheKey, isAuthorized, 5 * 60 * 1000 // 5 minutes caching period for Tenants Permissions
                );
            }
            else {
                isAuthorized = fromCache;
                console.log(`Tenant Permissions loaded from Cache with key: ${cacheKey}. Value: ${isAuthorized}`);
            }
        }
        // Log unauthorized access attempts
        if (!isAuthorized) {
            console.log(`Unauthorized access blocked. Tenant ID: ${tenantId}, Role ID: ${roleId}, Permissions Checked: ${permissions.join(', ')}`);
        }
        else {
            console.log(`Authorized access granted. Tenant ID: ${tenantId}, Role ID: ${roleId}, Permissions Checked: ${permissions.join(', ')}`);
        }
        return isAuthorized;
    }
};
exports.TenantPermissionGuard = TenantPermissionGuard;
exports.TenantPermissionGuard = TenantPermissionGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Reflector,
        role_permission_service_1.RolePermissionService])
], TenantPermissionGuard);
//# sourceMappingURL=tenant-permission.guard.js.map