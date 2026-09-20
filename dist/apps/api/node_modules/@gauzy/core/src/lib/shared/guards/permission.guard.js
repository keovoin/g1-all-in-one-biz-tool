"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const constants_1 = require("@gauzy/constants");
const utils_1 = require("@gauzy/utils");
const context_1 = require("./../../core/context");
const base_guard_1 = require("./base.guard");
const role_permission_service_1 = require("../../role-permission/role-permission.service");
let PermissionGuard = class PermissionGuard extends base_guard_1.BaseGuard {
    constructor(_cacheManager, _reflector, _rolePermissionService) {
        super();
        this._cacheManager = _cacheManager;
        this._reflector = _reflector;
        this._rolePermissionService = _rolePermissionService;
    }
    /**
     * Checks if the user is authorized based on specified permissions.
     * @param context The execution context.
     * @returns A promise that resolves to a boolean indicating authorization status.
     */
    async canActivate(context) {
        console.log('PermissionGuard canActivate called');
        // Retrieve permissions from metadata
        const targets = [context.getHandler(), context.getClass()];
        const permissions = (0, utils_1.deduplicate)(this._reflector.getAllAndOverride(constants_1.PERMISSIONS_METADATA, targets)) || [];
        // If no specific permissions are required, consider it authorized
        if ((0, utils_1.isEmpty)(permissions)) {
            return true;
        }
        // Identify the caller for the audit lines below from the request's DB-fresh user, never by
        // decoding the bearer token again: its `role` claim is whatever the user was when it was issued.
        const id = context_1.RequestContext.currentUserId();
        const role = context_1.RequestContext.currentRoleName();
        // Retrieve current role ID and tenant ID from RequestContext
        const tenantId = context_1.RequestContext.currentTenantId();
        const roleId = context_1.RequestContext.currentRoleId();
        const cacheKey = `userPermissions_${tenantId}_${roleId}_${permissions.join('_')}`;
        console.log('Checking User Permissions from Cache with key:', cacheKey);
        let isAuthorized = false;
        const fromCache = await this._cacheManager.get(cacheKey);
        if (fromCache == null) {
            console.log('User Permissions NOT loaded from Cache with key:', cacheKey);
            // Check if user has the required permissions
            isAuthorized = await this._rolePermissionService.checkRolePermission(tenantId, roleId, permissions, true);
            await this._cacheManager.set(cacheKey, isAuthorized, 5 * 60 * 1000 // 5 minutes cache expiration time for User Permissions
            );
        }
        else {
            isAuthorized = fromCache;
            console.log(`User Permissions loaded from Cache with key: ${cacheKey}. Value: ${isAuthorized}`);
        }
        // Log unauthorized access attempts
        if (!isAuthorized) {
            // Log unauthorized access attempts
            console.log(`Unauthorized access blocked: User ID: ${id}, Role: ${role}, Tenant ID:', ${tenantId}, Permissions Checked: ${permissions.join(', ')}`);
        }
        else {
            console.log(`Access granted.  User ID: ${id}, Role: ${role}, Tenant ID:', ${tenantId}, Permissions Checked: ${permissions.join(', ')}`);
        }
        return isAuthorized;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Reflector,
        role_permission_service_1.RolePermissionService])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map