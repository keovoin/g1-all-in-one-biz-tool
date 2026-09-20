"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocumentsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_upload_service_1 = require("../../services/document-upload.service");
const upload_documents_command_1 = require("../upload-documents.command");
let UploadDocumentsHandler = class UploadDocumentsHandler {
    constructor(documentUploadService) {
        this.documentUploadService = documentUploadService;
    }
    /**
     * Handles the `UploadDocumentsCommand`: runs the per-file validation gauntlet and
     * fans out one `Document` row + `docs.extract` job per accepted file.
     *
     * @param command - The command carrying the form fields and provider-mapped files.
     * @returns The per-file accept/reject envelope.
     */
    async execute(command) {
        return this.documentUploadService.uploadDocuments(command.input, command.files);
    }
};
exports.UploadDocumentsHandler = UploadDocumentsHandler;
exports.UploadDocumentsHandler = UploadDocumentsHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(upload_documents_command_1.UploadDocumentsCommand),
    tslib_1.__metadata("design:paramtypes", [document_upload_service_1.DocumentUploadService])
], UploadDocumentsHandler);
//# sourceMappingURL=upload-documents.handler.js.map