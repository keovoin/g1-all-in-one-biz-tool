"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManagerOrPermissionGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const core_1 = require("@nestjs/core");
const context_1 = require("../../core/context");
const guards_1 = require("../../shared/guards");
const role_permission_service_1 = require("../../role-permission/role-permission.service");
const organization_project_service_1 = require("../organization-project.service");
let ProjectManagerOrPermissionGuard = class ProjectManagerOrPermissionGuard extends guards_1.PermissionGuard {
    constructor(_cacheManager, _reflector, _rolePermissionService, _projectService) {
        super(_cacheManager, _reflector, _rolePermissionService);
        this._reflector = _reflector;
        this._rolePermissionService = _rolePermissionService;
        this._projectService = _projectService;
    }
    /**
     * Determines if the current user has access to the project.
     * @param context - The execution context of the request.
     * @returns A boolean indicating whether the user can proceed.
     */
    async canActivate(context) {
        // Extract request and projectId from params
        const request = super.getRequest(context);
        const projectIdParam = request.params?.id;
        // Handle case where projectId could be string or string[]
        const projectId = Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam;
        // Get employeeId from RequestContext
        const employeeId = context_1.RequestContext.currentEmployeeId();
        // If either employeeId or projectId is missing, defer to PermissionGuard
        if (!employeeId || !projectId) {
            console.log('⚠️ Missing employeeId or projectId, deferring to PermissionGuard.');
            return super.canActivate(context);
        }
        // Check if the user is a project manager
        const isManager = await this._projectService.isManagerOfProject(projectId, employeeId);
        if (isManager) {
            console.log(`✅ Access granted: User (employeeId: ${employeeId}) is manager of project ${projectId}.`);
            return true;
        }
        // If the user is not a manager, delegate the check to PermissionGuard
        return super.canActivate(context);
    }
};
exports.ProjectManagerOrPermissionGuard = ProjectManagerOrPermissionGuard;
exports.ProjectManagerOrPermissionGuard = ProjectManagerOrPermissionGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Reflector,
        role_permission_service_1.RolePermissionService,
        organization_project_service_1.OrganizationProjectService])
], ProjectManagerOrPermissionGuard);
//# sourceMappingURL=project-manager-or-permission.guard.js.map