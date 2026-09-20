"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const role_service_1 = require("./role.service");
const role_entity_1 = require("./role.entity");
const dto_1 = require("./dto");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
let RoleController = class RoleController extends crud_1.CrudController {
    constructor(roleService) {
        super(roleService);
        this.roleService = roleService;
    }
    /**
     * GET role by where condition
     *
     * @param options
     * @returns
     */
    async findOneRoleByOptions(options) {
        try {
            try {
                return await this.roleService.findOneByIdString(context_1.RequestContext.currentRoleId(), {
                    where: {
                        name: contracts_1.RolesEnum.EMPLOYEE
                    }
                });
            }
            catch (e) {
                return await this.roleService.findOneByWhereOptions(options);
            }
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    /**
     * GET roles for specific tenant
     *
     * @returns
     */
    async findAll() {
        return await this.roleService.findAll();
    }
    /**
     * CREATE role for specific tenant
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        try {
            return await this.roleService.create(entity);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * UPDATE role by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        try {
            await this.roleService.findOneByIdString(id);
            return await this.roleService.update(id, entity);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    /**
     * Deletes a role by its ID.
     * This endpoint handles HTTP DELETE requests to delete a role identified by the given ID.
     *
     * @param id - The UUID of the role to delete.
     * @returns {Promise<DeleteResult>} - The result of the delete operation.
     */
    async delete(id) {
        try {
            return await this.roleService.delete(id);
        }
        catch (error) {
            console.error('Error while deleting role:', error);
            throw new common_1.ForbiddenException(`Deletion of role with ID ${id} is forbidden`);
        }
    }
    /**
     * Import self hosted to gauzy cloud
     *
     * @param input
     * @returns
     */
    async importRole(input) {
        return await this.roleService.migrateImportRecord(input);
    }
};
exports.RoleController = RoleController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find role.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found role',
        type: role_entity_1.Role
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS, contracts_1.PermissionsEnum.ORG_TEAM_ADD),
    (0, common_1.Get)('options'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.FindRoleQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "findOneRoleByOptions", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find roles.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found roles.',
        type: role_entity_1.Role
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateRoleDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.CreateRoleDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Import role from self hosted to gauzy cloud hosted in bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Role have been successfully imported.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The request body may contain clues as to what went wrong'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.MIGRATE_GAUZY_CLOUD),
    (0, common_1.Post)('import/migrate'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleController.prototype, "importRole", null);
exports.RoleController = RoleController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Role'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.CHANGE_ROLES_PERMISSIONS),
    (0, common_1.Controller)('/roles'),
    tslib_1.__metadata("design:paramtypes", [role_service_1.RoleService])
], RoleController);
//# sourceMappingURL=role.controller.js.map