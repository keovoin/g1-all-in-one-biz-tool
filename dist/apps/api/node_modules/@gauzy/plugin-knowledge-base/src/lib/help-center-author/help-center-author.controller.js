"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterAuthorController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const help_center_author_entity_1 = require("./help-center-author.entity");
const help_center_author_service_1 = require("./help-center-author.service");
const cqrs_1 = require("@nestjs/cqrs");
const commands_1 = require("./commands");
const core_1 = require("@gauzy/core");
const contracts_1 = require("@gauzy/contracts");
let HelpCenterAuthorController = class HelpCenterAuthorController extends core_1.CrudController {
    constructor(commandBus, helpCenterAuthorService) {
        super(helpCenterAuthorService);
        this.commandBus = commandBus;
        this.helpCenterAuthorService = helpCenterAuthorService;
    }
    async findByArticleId(articleId) {
        return this.helpCenterAuthorService.findByArticleId(articleId);
    }
    async deleteBulkByArticleId(articleId) {
        return await this.commandBus.execute(new commands_1.KnowledgeBaseArticleBulkDeleteCommand(articleId));
    }
    async findAll(data) {
        const { relations = [], findInput = null } = data;
        return this.helpCenterAuthorService.findAll({
            relations,
            where: findInput
        });
    }
    async createBulk(input) {
        return this.commandBus.execute(new commands_1.ArticleAuthorsBulkCreateCommand(input));
    }
    /**
     * CREATE an article author row
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    async create(entity) {
        return super.create(entity);
    }
    /**
     * UPDATE an article author row by id
     *
     * Overrides the inherited `CrudController.update()` route only to attach the permission gate.
     */
    async update(id, entity) {
        return super.update(id, entity);
    }
    /**
     * DELETE an article author row by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    async delete(id) {
        return super.delete(id);
    }
    /**
     * SOFT DELETE an article author row by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    async softRemove(id, ...options) {
        return super.softRemove(id, ...options);
    }
    /**
     * RESTORE a soft-deleted article author row by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    async softRecover(id, ...options) {
        return super.softRecover(id, ...options);
    }
};
exports.HelpCenterAuthorController = HelpCenterAuthorController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find authors By Article Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found article authors',
        type: help_center_author_entity_1.HelpCenterAuthor
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('article/:articleId'),
    tslib_1.__param(0, (0, common_1.Param)('articleId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterAuthorController.prototype, "findByArticleId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Authors By Article Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found article authors',
        type: help_center_author_entity_1.HelpCenterAuthor
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Delete)('article/:articleId'),
    tslib_1.__param(0, (0, common_1.Param)('articleId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterAuthorController.prototype, "deleteBulkByArticleId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all authors.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found authors',
        type: help_center_author_entity_1.HelpCenterAuthor
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
], HelpCenterAuthorController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create authors in Bulk' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Authors have been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Post)('createBulk'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterAuthorController.prototype, "createBulk", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The record has been successfully created.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterAuthorController.prototype, "create", null);
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
], HelpCenterAuthorController.prototype, "update", null);
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
], HelpCenterAuthorController.prototype, "delete", null);
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
], HelpCenterAuthorController.prototype, "softRemove", null);
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
], HelpCenterAuthorController.prototype, "softRecover", null);
exports.HelpCenterAuthorController = HelpCenterAuthorController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('KnowledgeBaseAuthor'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), core_1.TenantPermissionGuard),
    (0, common_1.Controller)('/help-center-author'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        help_center_author_service_1.HelpCenterAuthorService])
], HelpCenterAuthorController);
//# sourceMappingURL=help-center-author.controller.js.map