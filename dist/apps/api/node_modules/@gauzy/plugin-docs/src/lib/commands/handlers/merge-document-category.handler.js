"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeDocumentCategoryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_category_service_1 = require("../../services/document-category.service");
const merge_document_category_command_1 = require("../merge-document-category.command");
let MergeDocumentCategoryHandler = class MergeDocumentCategoryHandler {
    constructor(documentCategoryService) {
        this.documentCategoryService = documentCategoryService;
    }
    /**
     * Handles the `MergeDocumentCategoryCommand`: re-points all document assignments to the
     * target (deduplicated), then soft-deletes the source.
     *
     * @param command - The command carrying the source id and target payload.
     * @returns The surviving category.
     */
    async execute(command) {
        return this.documentCategoryService.mergeCategory(command.id, command.input.targetId);
    }
};
exports.MergeDocumentCategoryHandler = MergeDocumentCategoryHandler;
exports.MergeDocumentCategoryHandler = MergeDocumentCategoryHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(merge_document_category_command_1.MergeDocumentCategoryCommand),
    tslib_1.__metadata("design:paramtypes", [document_category_service_1.DocumentCategoryService])
], MergeDocumentCategoryHandler);
//# sourceMappingURL=merge-document-category.handler.js.map