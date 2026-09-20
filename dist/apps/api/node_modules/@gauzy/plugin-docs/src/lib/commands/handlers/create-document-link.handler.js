"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDocumentLinkHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_link_service_1 = require("../../services/document-link.service");
const create_document_link_command_1 = require("../create-document-link.command");
let CreateDocumentLinkHandler = class CreateDocumentLinkHandler {
    constructor(documentLinkService) {
        this.documentLinkService = documentLinkService;
    }
    /**
     * Handles the `CreateDocumentLinkCommand`: idempotent link write on
     * `(documentId, entity, entityId)` — a duplicate returns the existing row.
     *
     * @param command - The command carrying the link payload.
     * @returns The created (or pre-existing) link.
     */
    async execute(command) {
        return this.documentLinkService.createLink(command.input);
    }
};
exports.CreateDocumentLinkHandler = CreateDocumentLinkHandler;
exports.CreateDocumentLinkHandler = CreateDocumentLinkHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_document_link_command_1.CreateDocumentLinkCommand),
    tslib_1.__metadata("design:paramtypes", [document_link_service_1.DocumentLinkService])
], CreateDocumentLinkHandler);
//# sourceMappingURL=create-document-link.handler.js.map