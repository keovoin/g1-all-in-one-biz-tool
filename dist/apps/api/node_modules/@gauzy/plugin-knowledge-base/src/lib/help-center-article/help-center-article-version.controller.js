"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleVersionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const help_center_article_version_entity_1 = require("./help-center-article-version.entity");
const help_center_article_version_service_1 = require("./help-center-article-version.service");
/**
 * Controller for HelpCenterArticleVersion.
 *
 * Versions are created automatically when articles are updated via updateWithVersioning().
 * This controller provides read-only access + restore functionality.
 */
let HelpCenterArticleVersionController = class HelpCenterArticleVersionController extends core_1.CrudController {
    constructor(articleVersionService) {
        super(articleVersionService);
        this.articleVersionService = articleVersionService;
    }
    /**
     * Get all versions (with optional filtering by articleId)
     * Usage: GET /?where[articleId]=xxx&order[lastSavedAt]=DESC
     */
    async findAll(options) {
        return this.articleVersionService.findAll(options);
    }
    /**
     * Get a specific version by ID
     */
    async findById(id, options) {
        return this.articleVersionService.findOneByIdString(id, options);
    }
    /**
     * Restore an article to a specific version's content.
     * Copies the version's descriptionHtml/Json back to the article.
     */
    async restoreVersion(versionId) {
        return this.articleVersionService.restoreToVersion(versionId);
    }
    /**
     * CREATE an article version row
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    async create(entity) {
        return super.create(entity);
    }
    /**
     * UPDATE an article version row by id
     *
     * Overrides the inherited `CrudController.update()` route only to attach the permission gate.
     * A stored version is what `POST :id/restore` copies back into the article, so rewriting one is
     * a write to the article's content by another name.
     */
    async update(id, entity) {
        return super.update(id, entity);
    }
    /**
     * DELETE an article version row by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    async delete(id) {
        return super.delete(id);
    }
    /**
     * SOFT DELETE an article version row by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    async softRemove(id, ...options) {
        return super.softRemove(id, ...options);
    }
    /**
     * RESTORE a soft-deleted article version row by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    async softRecover(id, ...options) {
        return super.softRecover(id, ...options);
    }
};
exports.HelpCenterArticleVersionController = HelpCenterArticleVersionController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all versions' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Versions retrieved successfully',
        type: help_center_article_version_entity_1.HelpCenterArticleVersion,
        isArray: true
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleVersionController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get version by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Version retrieved successfully',
        type: help_center_article_version_entity_1.HelpCenterArticleVersion
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Version not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleVersionController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore article to a specific version' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Article restored to version successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Version not found'
    }),
    (0, common_1.UseGuards)(core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.ORG_HELP_CENTER_EDIT),
    (0, common_1.Post)(':id/restore'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HelpCenterArticleVersionController.prototype, "restoreVersion", null);
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
], HelpCenterArticleVersionController.prototype, "create", null);
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
], HelpCenterArticleVersionController.prototype, "update", null);
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
], HelpCenterArticleVersionController.prototype, "delete", null);
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
], HelpCenterArticleVersionController.prototype, "softRemove", null);
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
], HelpCenterArticleVersionController.prototype, "softRecover", null);
exports.HelpCenterArticleVersionController = HelpCenterArticleVersionController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('KnowledgeBaseArticleVersion'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), core_1.TenantPermissionGuard),
    (0, common_1.Controller)('/help-center-article-version'),
    tslib_1.__metadata("design:paramtypes", [help_center_article_version_service_1.HelpCenterArticleVersionService])
], HelpCenterArticleVersionController);
//# sourceMappingURL=help-center-article-version.controller.js.map