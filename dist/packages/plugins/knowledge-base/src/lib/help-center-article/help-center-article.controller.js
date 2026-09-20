"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const cqrs_1 = require("@nestjs/cqrs");
const core_1 = require("@gauzy/core");
const help_center_article_entity_1 = require("./help-center-article.entity");
const help_center_article_service_1 = require("./help-center-article.service");
const commands_1 = require("./commands");
const help_center_article_update_command_1 = require("./commands/help-center-article.update.command");
const dto_1 = require("./dto");
let HelpCenterArticleController = class HelpCenterArticleController extends core_1.CrudController {
    constructor(helpCenterArticleService, commandBus) {
        super(helpCenterArticleService);
        this.helpCenterArticleService = helpCenterArticleService;
        this.commandBus = commandBus;
    }
    async create(entity) {
        return this.helpCenterArticleService.create(entity);
    }
    /**
     * Create a copy of an article (without binary content).
     */
    async duplicate(id) {
        return this.helpCenterArticleService.duplicate(id);
    }
    async findByCategoryId(categoryId) {
        return this.helpCenterArticleService.getArticlesByCategoryId(categoryId);
    }
    async findByProjectId(projectId, options) {
        return this.helpCenterArticleService.getArticlesByProjectId(projectId, options);
    }
    /**
     * Returns the Y.js binary state as application/octet-stream.
     * Returns an empty buffer if no binary is stored yet.
     */
    async getDescription(id, res) {
        const binary = await this.helpCenterArticleService.getDescriptionBinary(id);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(binary ?? Buffer.alloc(0));
    }
    /**
     * Upload raw binary description (application/octet-stream).
     * Bypasses JSON serialization so Uint8Array is stored correctly in the DB.
     */
    async uploadBinaryDescription(id, req) {
        const binary = await this.helpCenterArticleService.readBinaryStream(req);
        await this.commandBus.execute(new help_center_article_update_command_1.HelpCenterUpdateArticleCommand(id, { descriptionBinary: binary }));
    }
    /**
     * Atomic update of all description fields (binary, HTML, JSON).
     *
     * Binary content is received as a base64-encoded string and decoded server-side.
     * Uses a direct QueryBuilder update to bypass TypeORM's QueryDeepPartialEntity
     * typing, which silently drops Buffer values for Uint8Array-typed entity fields.
     */
    async patchDescription(id, body) {
        await this.helpCenterArticleService.updateDescriptionFields(id, {
            descriptionBinary: body.descriptionBinary ? Buffer.from(body.descriptionBinary, 'base64') : undefined,
            descriptionHtml: body.descriptionHtml,
            descriptionJson: body.descriptionJson !== undefined
                ? typeof body.descriptionJson === 'string'
                    ? body.descriptionJson
                    : JSON.stringify(body.descriptionJson)
                : undefined
        });
    }
    async deleteBulkByCategoryId(categoryId) {
        return this.commandBus.execute(new commands_1.KnowledgeBaseCategoryBulkDeleteCommand(categoryId));
    }
    /**
     * UPDATE Help Center Article By Id
     *
     * @param id
     * @param updateInput
     * @returns
     */
    async update(id, updateInput) {
        return await this.commandBus.execute(new help_center_article_update_command_1.HelpCenterUpdateArticleCommand(id, updateInput));
    }
    /**
     * DELETE Help Center Article By Id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here. This is
     * the route the Angular Help Center uses to delete an article.
     */
    async delete(id) {
        return super.delete(id);
    }
    /**
     * SOFT DELETE Help Center Article By Id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    async softRemove(id, ...options) {
        return super.softRemove(id, ...options);
    }
    /**
     * RESTORE a soft-deleted Help Center Article By Id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    async softRecover(id, ...options) {
        return super.softRecover(id, ...options);
    }
};
exports.HelpCenterArticleController = HelpCenterArticleController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create new article'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Success Add article',
        type: help_center_article_entity_1.HelpCenterArticle
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate an article' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Article duplicated.', type: help_center_article_entity_1.HelpCenterArticle }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(':id/duplicate'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "duplicate", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find articles By Category Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found category articles',
        type: help_center_article_entity_1.HelpCenterArticle
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('category/:categoryId'),
    tslib_1.__param(0, (0, common_1.Param)('categoryId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "findByCategoryId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find articles By Project Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found project articles',
        type: help_center_article_entity_1.HelpCenterArticle
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('project/:projectId'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('projectId', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "findByProjectId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get article binary description' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Binary returned.' }),
    (0, common_1.Get)(':id/description'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "getDescription", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload binary description (octet-stream)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Binary saved.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Put)(':id/binary-description'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "uploadBinaryDescription", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atomic update of all description fields (binary + HTML + JSON)' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Description updated.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Patch)(':id/description'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "patchDescription", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete Articles By Category Id.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Deleted Articles By Category Id',
        type: help_center_article_entity_1.HelpCenterArticle
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Delete)('category/:categoryId'),
    tslib_1.__param(0, (0, common_1.Param)('categoryId', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "deleteBulkByCategoryId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
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
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Put)(':id'),
    (0, core_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateHelpCenterArticleDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleController.prototype, "update", null);
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
], HelpCenterArticleController.prototype, "delete", null);
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
], HelpCenterArticleController.prototype, "softRemove", null);
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
], HelpCenterArticleController.prototype, "softRecover", null);
exports.HelpCenterArticleController = HelpCenterArticleController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('KnowledgeBaseArticle'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), core_1.TenantPermissionGuard),
    (0, common_1.Controller)('/help-center-article'),
    tslib_1.__metadata("design:paramtypes", [help_center_article_service_1.HelpCenterArticleService,
        cqrs_1.CommandBus])
], HelpCenterArticleController);
//# sourceMappingURL=help-center-article.controller.js.map