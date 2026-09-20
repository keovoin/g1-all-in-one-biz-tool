"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const update_document_command_1 = require("../update-document.command");
let UpdateDocumentHandler = class UpdateDocumentHandler {
    constructor(documentService) {
        this.documentService = documentService;
    }
    /**
     * Handles the `UpdateDocumentCommand`: partial metadata-only update.
     *
     * @param command - The command carrying the id and update payload.
     * @returns The updated document.
     */
    async execute(command) {
        return this.documentService.updateDocument(command.id, command.input);
    }
};
exports.UpdateDocumentHandler = UpdateDocumentHandler;
exports.UpdateDocumentHandler = UpdateDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_document_command_1.UpdateDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService])
], UpdateDocumentHandler);
//# sourceMappingURL=update-document.handler.js.map