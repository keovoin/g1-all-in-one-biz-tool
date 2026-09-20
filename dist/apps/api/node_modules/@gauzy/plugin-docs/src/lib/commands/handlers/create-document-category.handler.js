"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDocumentCategoryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_category_service_1 = require("../../services/document-category.service");
const create_document_category_command_1 = require("../create-document-category.command");
let CreateDocumentCategoryHandler = class CreateDocumentCategoryHandler {
    constructor(documentCategoryService) {
        this.documentCategoryService = documentCategoryService;
    }
    /**
     * Handles the `CreateDocumentCategoryCommand`: creates a catalog entry (case-insensitive
     * unique name per org; slug auto-derived when absent).
     *
     * @param command - The command carrying the create payload.
     * @returns The created category.
     */
    async execute(command) {
        return this.documentCategoryService.createCategory(command.input);
    }
};
exports.CreateDocumentCategoryHandler = CreateDocumentCategoryHandler;
exports.CreateDocumentCategoryHandler = CreateDocumentCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_document_category_command_1.CreateDocumentCategoryCommand),
    tslib_1.__metadata("design:paramtypes", [document_category_service_1.DocumentCategoryService])
], CreateDocumentCategoryHandler);
//# sourceMappingURL=create-document-category.handler.js.map