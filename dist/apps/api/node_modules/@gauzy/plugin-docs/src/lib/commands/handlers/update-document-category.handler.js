"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentCategoryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_category_service_1 = require("../../services/document-category.service");
const update_document_category_command_1 = require("../update-document-category.command");
let UpdateDocumentCategoryHandler = class UpdateDocumentCategoryHandler {
    constructor(documentCategoryService) {
        this.documentCategoryService = documentCategoryService;
    }
    /**
     * Handles the `UpdateDocumentCategoryCommand`: updates a catalog entry (`isSystem` rows:
     * rename allowed, slug immutable).
     *
     * @param command - The command carrying the id and update payload.
     * @returns The updated category.
     */
    async execute(command) {
        return this.documentCategoryService.updateCategory(command.id, command.input);
    }
};
exports.UpdateDocumentCategoryHandler = UpdateDocumentCategoryHandler;
exports.UpdateDocumentCategoryHandler = UpdateDocumentCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_document_category_command_1.UpdateDocumentCategoryCommand),
    tslib_1.__metadata("design:paramtypes", [document_category_service_1.DocumentCategoryService])
], UpdateDocumentCategoryHandler);
//# sourceMappingURL=update-document-category.handler.js.map