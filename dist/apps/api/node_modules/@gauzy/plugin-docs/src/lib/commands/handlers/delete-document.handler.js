"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_tree_service_1 = require("../../services/document-tree.service");
const delete_document_command_1 = require("../delete-document.command");
let DeleteDocumentHandler = class DeleteDocumentHandler {
    constructor(documentService, documentTreeService) {
        this.documentService = documentService;
        this.documentTreeService = documentTreeService;
    }
    /**
     * Handles the `DeleteDocumentCommand`: soft delete, allowed only from archived state
     * (archive-first workflow), with `subtree` or `promote-children` strategy.
     *
     * @param command - The command carrying the id and strategy.
     * @returns The soft-deleted document.
     */
    async execute(command) {
        const document = await this.documentService.findOneScoped(command.id);
        await this.documentService.assertCanWrite(document);
        const deleted = await this.documentTreeService.deleteDocument(document, command.strategy);
        this.documentService.emitDocumentEvent(deleted, 'deleted');
        return deleted;
    }
};
exports.DeleteDocumentHandler = DeleteDocumentHandler;
exports.DeleteDocumentHandler = DeleteDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_document_command_1.DeleteDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_tree_service_1.DocumentTreeService])
], DeleteDocumentHandler);
//# sourceMappingURL=delete-document.handler.js.map