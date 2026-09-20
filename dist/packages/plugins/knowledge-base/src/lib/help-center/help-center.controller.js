"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const help_center_service_1 = require("./help-center.service");
const help_center_entity_1 = require("./help-center.entity");
const commands_1 = require("./commands");
let HelpCenterController = class HelpCenterController extends core_1.CrudController {
    constructor(helpCenterService, commandBus) {
        super(helpCenterService);
        this.helpCenterService = helpCenterService;
        this.commandBus = commandBus;
    }
    async findAll(data) {
        const { relations = [], findInput = null } = data;
        return this.helpCenterService.findAll({
            relations,
            where: findInput
        });
    }
    async create(entity) {
        return this.helpCenterService.create(entity);
    }
    async updateBulk(input) {
        const { oldChildren = [], newChildren = [] } = input;
        return await this.commandBus.execute(new commands_1.HelpCenterUpdateCommand(oldChildren, newChildren));
    }
    async findByBaseId(baseId) {
        return this.helpCenterService.getCategoriesByBaseId(baseId);
    }
    async deleteBulkByBaseId(baseId) {
        return await this.commandBus.execute(new commands_1.KnowledgeBaseBulkDeleteCommand(baseId));
    }
    /**
     * UPDATE a knowledge base / category by id
     *
     * Overrides the inherited `CrudController.update()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    async update(id, entity) {
        return super.update(id, entity);
    }
    /**
     * DELETE a knowledge base / category by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    async delete(id) {
        return super.delete(id);
    }
    /**
     * SOFT DELETE a knowledge base / category by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    async softRemove(id, ...options) {
        return super.softRemove(id, ...options);
    }
    /**
     * RESTORE a soft-deleted knowledge base / category by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    async softRecover(id, ...options) {
        return super.softRecover(id, ...options);
    }
};
exports.HelpCenterController = HelpCenterController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all menus.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found tree',
        type: help_center_entity_1.HelpCenter
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', core_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create new category'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Success Add category',
        type: help_center_entity_1.HelpCenter
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update indexes in Bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Indexes have been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Post)('updateBulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "updateBulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find Categories By Base Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found base categories',
        type: help_center_entity_1.HelpCenter
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('base/:baseId'),
    tslib_1.__param(0, (0, common_1.Param)('baseId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "findByBaseId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Categories By Base Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found base categories',
        type: help_center_entity_1.HelpCenter
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Delete)('base/:baseId'),
    tslib_1.__param(0, (0, common_1.Param)('baseId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "deleteBulkByBaseId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The record has been successfully edited.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The record has been successfully deleted' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a record by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'Record soft deleted successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Delete)(':id/soft'),
    (0, common_1.UsePipes)(new core_1.AbstractValidationPipe({ whitelist: true }, { query: core_1.TenantOrganizationBaseDTO })),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "softRemove", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted record by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'Record restored successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Put)(':id/recover'),
    (0, common_1.UsePipes)(new core_1.AbstractValidationPipe({ whitelist: true }, { query: core_1.TenantOrganizationBaseDTO })),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterController.prototype, "softRecover", null);
exports.HelpCenterController = HelpCenterController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('KnowledgeBase'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), core_1.TenantPermissionGuard),
    (0, common_1.Controller)('/help-center'),
    tslib_1.__metadata("design:paramtypes", [help_center_service_1.HelpCenterService,
        cqrs_1.CommandBus])
], HelpCenterController);
//# sourceMappingURL=help-center.controller.js.map