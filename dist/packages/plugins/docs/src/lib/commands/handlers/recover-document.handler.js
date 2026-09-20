"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_tree_service_1 = require("../../services/document-tree.service");
const recover_document_command_1 = require("../recover-document.command");
let RecoverDocumentHandler = class RecoverDocumentHandler {
    constructor(documentService, documentTreeService) {
        this.documentService = documentService;
        this.documentTreeService = documentTreeService;
    }
    /**
     * Handles the `RecoverDocumentCommand`: restores a soft-deleted document (re-parented to
     * root if the original parent is still deleted); the document returns in archived state.
     *
     * The trashed row is resolved through the full read scope first (tenant + organization +
     * visibility/ownership/share), so an id from another organization — or someone else's
     * PRIVATE document — is a 404 and is never un-deleted or returned.
     *
     * @param command - The command carrying the id.
     * @returns The recovered document.
     */
    async execute(command) {
        const document = await this.documentService.findOneDeletedScoped(command.id);
        await this.documentService.assertCanWrite(document);
        const recovered = await this.documentTreeService.recoverDocument(document);
        this.documentService.emitDocumentEvent(recovered, 'updated');
        return recovered;
    }
};
exports.RecoverDocumentHandler = RecoverDocumentHandler;
exports.RecoverDocumentHandler = RecoverDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(recover_document_command_1.RecoverDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_tree_service_1.DocumentTreeService])
], RecoverDocumentHandler);
//# sourceMappingURL=recover-document.handler.js.map