"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentLinkHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_link_service_1 = require("../../services/document-link.service");
const delete_document_link_command_1 = require("../delete-document-link.command");
let DeleteDocumentLinkHandler = class DeleteDocumentLinkHandler {
    constructor(documentLinkService) {
        this.documentLinkService = documentLinkService;
    }
    /**
     * Handles the `DeleteDocumentLinkCommand`: soft-deletes a link.
     *
     * @param command - The command carrying the id.
     * @returns The soft-deleted link.
     */
    async execute(command) {
        return this.documentLinkService.deleteLink(command.id);
    }
};
exports.DeleteDocumentLinkHandler = DeleteDocumentLinkHandler;
exports.DeleteDocumentLinkHandler = DeleteDocumentLinkHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_document_link_command_1.DeleteDocumentLinkCommand),
    tslib_1.__metadata("design:paramtypes", [document_link_service_1.DocumentLinkService])
], DeleteDocumentLinkHandler);
//# sourceMappingURL=delete-document-link.handler.js.map