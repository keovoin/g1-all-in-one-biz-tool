"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const create_document_category_command_1 = require("../commands/create-document-category.command");
const delete_document_category_command_1 = require("../commands/delete-document-category.command");
const merge_document_category_command_1 = require("../commands/merge-document-category.command");
const update_document_category_command_1 = require("../commands/update-document-category.command");
const dto_1 = require("../dto");
const document_category_entity_1 = require("../entities/document-category.entity");
const get_document_categories_query_1 = require("../queries/get-document-categories.query");
let DocumentCategoryController = class DocumentCategoryController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * The per-tenant/org category catalog, sorted by name; each item includes `documentCount`.
     */
    async findAll(params) {
        return this.queryBus.execute(new get_document_categories_query_1.GetDocumentCategoriesQuery(params));
    }
    /**
     * Creates a catalog entry (duplicate name → 409 `DOCS_CATEGORY_EXISTS`; slug auto-derived
     * when absent).
     */
    async create(input) {
        return this.commandBus.execute(new create_document_category_command_1.CreateDocumentCategoryCommand(input));
    }
    /**
     * Updates a catalog entry (`isSystem` rows: rename allowed, slug immutable).
     */
    async update(id, input) {
        return this.commandBus.execute(new update_document_category_command_1.UpdateDocumentCategoryCommand(id, input));
    }
    /**
     * Re-points all document assignments to `targetId` (deduplicated), then soft-deletes the
     * source. Self-merge → 400.
     */
    async merge(id, input) {
        return this.commandBus.execute(new merge_document_category_command_1.MergeDocumentCategoryCommand(id, input));
    }
    /**
     * Deletes a catalog entry (`isSystem: true` → 409 `DOCS_CATEGORY_SYSTEM`); in-use categories
     * are detached from documents, then soft-deleted.
     */
    async delete(id) {
        return this.commandBus.execute(new delete_document_category_command_1.DeleteDocumentCategoryCommand(id));
    }
};
exports.DocumentCategoryController = DocumentCategoryController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List the document category catalog.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Catalog retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a document category.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Category created successfully.', type: document_category_entity_1.DocumentCategory }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'A category with this name already exists.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateDocumentCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a document category.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Category updated successfully.', type: document_category_entity_1.DocumentCategory }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateDocumentCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Merge one category into another.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Categories merged successfully.', type: document_category_entity_1.DocumentCategory }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)('/:id/merge'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.MergeDocumentCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "merge", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a document category.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Category deleted successfully.', type: document_category_entity_1.DocumentCategory }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'System categories cannot be deleted.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentCategoryController.prototype, "delete", null);
exports.DocumentCategoryController = DocumentCategoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/categories'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], DocumentCategoryController);
//# sourceMappingURL=document-category.controller.js.map