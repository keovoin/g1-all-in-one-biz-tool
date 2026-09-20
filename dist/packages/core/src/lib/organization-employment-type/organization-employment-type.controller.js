"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationEmploymentTypeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const organization_employment_type_entity_1 = require("./organization-employment-type.entity");
const organization_employment_type_service_1 = require("./organization-employment-type.service");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./../core/dto");
let OrganizationEmploymentTypeController = class OrganizationEmploymentTypeController extends crud_1.CrudController {
    constructor(organizationEmploymentTypeService) {
        super(organizationEmploymentTypeService);
        this.organizationEmploymentTypeService = organizationEmploymentTypeService;
    }
    /**
     * GET all organization employment types
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { findInput, relations } = data;
        return this.organizationEmploymentTypeService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * UPDATE organization employment type by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        try {
            return this.organizationEmploymentTypeService.create({ ...entity, id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * CREATE organization employment type
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    async create(entity) {
        return super.create(entity);
    }
    /**
     * DELETE organization employment type by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    async delete(id) {
        return super.delete(id);
    }
    /**
     * SOFT DELETE organization employment type by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    async softRemove(id, ...options) {
        return super.softRemove(id, ...options);
    }
    /**
     * RESTORE a soft-deleted organization employment type by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    async softRecover(id, ...options) {
        return super.softRecover(id, ...options);
    }
};
exports.OrganizationEmploymentTypeController = OrganizationEmploymentTypeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization employment types.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employment types',
        type: organization_employment_type_entity_1.OrganizationEmploymentType
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationEmploymentTypeController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, organization_employment_type_entity_1.OrganizationEmploymentType]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationEmploymentTypeController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The record has been successfully created.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationEmploymentTypeController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The record has been successfully deleted' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationEmploymentTypeController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a record by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'Record soft deleted successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Delete)(':id/soft'),
    (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ whitelist: true }, { query: dto_1.TenantOrganizationBaseDTO })),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationEmploymentTypeController.prototype, "softRemove", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted record by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'Record restored successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Put)(':id/recover'),
    (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ whitelist: true }, { query: dto_1.TenantOrganizationBaseDTO })),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationEmploymentTypeController.prototype, "softRecover", null);
exports.OrganizationEmploymentTypeController = OrganizationEmploymentTypeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationEmploymentType'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/organization-employment-type'),
    tslib_1.__metadata("design:paramtypes", [organization_employment_type_service_1.OrganizationEmploymentTypeService])
], OrganizationEmploymentTypeController);
//# sourceMappingURL=organization-employment-type.controller.js.map