"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentContentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const update_document_content_command_1 = require("../update-document-content.command");
let UpdateDocumentContentHandler = class UpdateDocumentContentHandler {
    constructor(documentService) {
        this.documentService = documentService;
    }
    /**
     * Handles the `UpdateDocumentContentCommand`: PAGE content save with optimistic concurrency
     * (409), lock enforcement (423), debounced version snapshot, and mention diff-sync.
     *
     * @param command - The command carrying the id and content payload.
     * @returns The updated document.
     */
    async execute(command) {
        return this.documentService.updateContent(command.id, command.input);
    }
};
exports.UpdateDocumentContentHandler = UpdateDocumentContentHandler;
exports.UpdateDocumentContentHandler = UpdateDocumentContentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_document_content_command_1.UpdateDocumentContentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService])
], UpdateDocumentContentHandler);
//# sourceMappingURL=update-document-content.handler.js.map