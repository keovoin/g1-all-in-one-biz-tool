"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentCategoryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_category_service_1 = require("../../services/document-category.service");
const delete_document_category_command_1 = require("../delete-document-category.command");
let DeleteDocumentCategoryHandler = class DeleteDocumentCategoryHandler {
    constructor(documentCategoryService) {
        this.documentCategoryService = documentCategoryService;
    }
    /**
     * Handles the `DeleteDocumentCategoryCommand`: detaches the category from documents, then
     * soft-deletes it (`isSystem: true` rows are rejected with 409).
     *
     * @param command - The command carrying the id.
     * @returns The soft-deleted category.
     */
    async execute(command) {
        return this.documentCategoryService.deleteCategory(command.id);
    }
};
exports.DeleteDocumentCategoryHandler = DeleteDocumentCategoryHandler;
exports.DeleteDocumentCategoryHandler = DeleteDocumentCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_document_category_command_1.DeleteDocumentCategoryCommand),
    tslib_1.__metadata("design:paramtypes", [document_category_service_1.DocumentCategoryService])
], DeleteDocumentCategoryHandler);
//# sourceMappingURL=delete-document-category.handler.js.map