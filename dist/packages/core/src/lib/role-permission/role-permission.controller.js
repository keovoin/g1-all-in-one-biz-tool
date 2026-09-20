"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
const role_permission_entity_1 = require("./role-permission.entity");
const role_permission_service_1 = require("./role-permission.service");
let RolePermissionController = class RolePermissionController extends crud_1.CrudController {
    constructor(_rolePermissionService) {
        super(_rolePermissionService);
        this._rolePermissionService = _rolePermissionService;
    }
    /**
     * Import/Migrate role-permissions for specific tenant
     *
     * @param input
     * @returns
     */
    async importRole(input) {
        return await this._rolePermissionService.migrateImportRecord(input);
    }
    /**
     * Retrieves the permissions of the current user.
     *
     * @return {Promise<IPagination<RolePermission>>} A Promise that resolves to a paginated list of RolePermission objects.
     */
    async findMePermissions() {
        return await this._rolePermissionService.findMePermissions();
    }
    /**
     * GET role permissions for a specific tenant with pagination.
     *
     * @param {BaseQueryDTO<RolePermission>} query - The query parameters for pagination and filtering.
     * @returns {Promise<IPagination<IRolePermission>>} - Returns a promise that resolves to a paginated list of role permissions.
     */
    async findAllRolePermissions(query) {
        return this._rolePermissionService.findAllRolePermissions(query);
    }
    /**
     * CREATE role permissions for specific tenant
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this._rolePermissionService.createPermission(entity);
    }
    /**
     * UPDATE role permissions for specific tenant
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this._rolePermissionService.updatePermission(id, entity);
    }
    /**
     * DELETE role permissions for specific tenant
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await this._rolePermissionService.deletePermission(id);
    }
};
exports.RolePermissionController = RolePermissionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Import role-permissions from self hosted to gauzy cloud hosted in bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Role Permissions have been successfully imported.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The request body may contain clues as to what went wrong'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.MIGRATE_GAUZY_CLOUD),
    (0, common_1.Post)('/import/migrate'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolePermissionController.prototype, "importRole", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find current user permissions.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found current user permissions',
        isArray: true
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Permissions not found'
    }),
    (0, decorators_1.Permissions)(),
    (0, common_1.Get)('/me'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], RolePermissionController.prototype, "findMePermissions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve role permissions for a specific tenant.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found role permissions.',
        type: role_permission_entity_1.RolePermission
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)(['/pagination', '/']),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], RolePermissionController.prototype, "findAllRolePermissions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateRolePermissionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], RolePermissionController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateRolePermissionDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], RolePermissionController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RolePermissionController.prototype, "delete", null);
exports.RolePermissionController = RolePermissionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Role'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS),
    (0, common_1.Controller)('/role-permissions'),
    tslib_1.__metadata("design:paramtypes", [role_permission_service_1.RolePermissionService])
], RolePermissionController);
//# sourceMappingURL=role-permission.controller.js.map