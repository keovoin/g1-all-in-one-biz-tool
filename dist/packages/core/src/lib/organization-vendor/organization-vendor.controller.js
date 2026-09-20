"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationVendorController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const organization_vendor_service_1 = require("./organization-vendor.service");
const organization_vendor_entity_1 = require("./organization-vendor.entity");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./../core/dto");
let OrganizationVendorController = class OrganizationVendorController extends crud_1.CrudController {
    constructor(organizationVendorService) {
        super(organizationVendorService);
        this.organizationVendorService = organizationVendorService;
    }
    /**
     * GET all organization vendors recurring expense
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput, order } = data;
        return this.organizationVendorService.findAll({
            where: findInput,
            order,
            relations
        });
    }
    async pagination(filter) {
        return this.organizationVendorService.pagination(filter);
    }
    /**
     * UPDATE organization vendor by id
     *
     * @param id
     * @param body
     * @returns
     */
    async update(id, body) {
        return this.organizationVendorService.create({ ...body, id });
    }
    /**
     * DELETE organization vendor by id
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return this.organizationVendorService.deleteVendor(id);
    }
    /**
     * SOFT DELETE organization vendor by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    async softRemove(id, ...options) {
        return super.softRemove(id, ...options);
    }
    /**
     * RESTORE a soft-deleted organization vendor by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    async softRecover(id, ...options) {
        return super.softRecover(id, ...options);
    }
};
exports.OrganizationVendorController = OrganizationVendorController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization vendors recurring expense.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization vendors recurring expense',
        type: organization_vendor_entity_1.OrganizationVendor
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
], OrganizationVendorController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationVendorController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, organization_vendor_entity_1.OrganizationVendor]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationVendorController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "This Vendor can't be deleted because it is used in expense records"
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationVendorController.prototype, "delete", null);
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
], OrganizationVendorController.prototype, "softRemove", null);
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
], OrganizationVendorController.prototype, "softRecover", null);
exports.OrganizationVendorController = OrganizationVendorController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationVendor'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/organization-vendors'),
    tslib_1.__metadata("design:paramtypes", [organization_vendor_service_1.OrganizationVendorService])
], OrganizationVendorController);
//# sourceMappingURL=organization-vendor.controller.js.map