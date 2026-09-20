"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerOrPermissionGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const permission_guard_1 = require("./permission.guard");
const context_1 = require("../../core/context");
const managed_employee_service_1 = require("../../employee/managed-employee.service");
const role_permission_service_1 = require("../../role-permission/role-permission.service");
const utils_1 = require("@gauzy/utils");
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
let ManagerOrPermissionGuard = class ManagerOrPermissionGuard extends permission_guard_1.PermissionGuard {
    constructor(_cacheManager, _reflector, _rolePermissionService, _managedEmployeeService) {
        super(_cacheManager, _reflector, _rolePermissionService);
        this._cacheManager = _cacheManager;
        this._reflector = _reflector;
        this._rolePermissionService = _rolePermissionService;
        this._managedEmployeeService = _managedEmployeeService;
    }
    /**
     * Determines if the current user can activate the route.
     *
     * @param context - The execution context
     * @returns True if user is a manager of specified teams/projects OR has required permissions
     */
    async canActivate(context) {
        const employeeId = context_1.RequestContext.currentEmployeeId();
        // If no employeeId, fall back to permission check
        if (!employeeId) {
            return super.canActivate(context);
        }
        try {
            const request = this.getRequest(context);
            // Extract teamIds and projectIds from query or body
            const teamIds = this.extractIds(request, 'teamIds', 'organizationTeamId');
            const projectIds = this.extractIds(request, 'projectIds', 'projectId');
            // If teamIds or projectIds are provided, check if user is a manager
            if ((0, utils_1.isNotEmpty)(teamIds) || (0, utils_1.isNotEmpty)(projectIds)) {
                const isManager = await this._managedEmployeeService.isManagerOfTeamsOrProjects(employeeId, teamIds, projectIds);
                if (isManager) {
                    return true; // User is a manager → Grant access
                }
            }
            // Not a manager or no teams/projects specified → Check permissions
            return super.canActivate(context);
        }
        catch (error) {
            // On error, fall back to permission check
            return super.canActivate(context);
        }
    }
    /**
     * Extracts IDs from request query or body.
     * Handles both array and single value cases.
     *
     * @param request - The HTTP request
     * @param arrayKey - The key for array values (e.g., 'teamIds')
     * @param singleKey - The key for single values (e.g., 'organizationTeamId')
     * @returns Array of IDs
     */
    extractIds(request, arrayKey, singleKey) {
        const ids = [];
        // Check query params
        if (request.query) {
            if (request.query[arrayKey]) {
                const queryIds = Array.isArray(request.query[arrayKey])
                    ? request.query[arrayKey]
                    : [request.query[arrayKey]];
                ids.push(...queryIds);
            }
            if (request.query[singleKey]) {
                ids.push(request.query[singleKey]);
            }
        }
        // Check body params
        if (request.body) {
            if (request.body[arrayKey]) {
                const bodyIds = Array.isArray(request.body[arrayKey])
                    ? request.body[arrayKey]
                    : [request.body[arrayKey]];
                ids.push(...bodyIds);
            }
            if (request.body[singleKey]) {
                ids.push(request.body[singleKey]);
            }
        }
        // Remove duplicates and filter out undefined/null
        return [...new Set(ids)].filter((id) => id != null);
    }
};
exports.ManagerOrPermissionGuard = ManagerOrPermissionGuard;
exports.ManagerOrPermissionGuard = ManagerOrPermissionGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Reflector,
        role_permission_service_1.RolePermissionService,
        managed_employee_service_1.ManagedEmployeeService])
], ManagerOrPermissionGuard);
//# sourceMappingURL=manager-or-permission.guard.js.map