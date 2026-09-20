"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceDocumentFileHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_upload_service_1 = require("../../services/document-upload.service");
const replace_document_file_command_1 = require("../replace-document-file.command");
let ReplaceDocumentFileHandler = class ReplaceDocumentFileHandler {
    constructor(documentUploadService) {
        this.documentUploadService = documentUploadService;
    }
    /**
     * Handles the `ReplaceDocumentFileCommand`: swaps the stored blob of an existing FILE
     * document in place, bumps `version` and re-runs the pipeline (R-UPL-05).
     *
     * @param command - The command carrying the document id, form fields and the new file.
     * @returns The document after the swap.
     */
    async execute(command) {
        return this.documentUploadService.replaceFile(command.id, command.file, command.input);
    }
};
exports.ReplaceDocumentFileHandler = ReplaceDocumentFileHandler;
exports.ReplaceDocumentFileHandler = ReplaceDocumentFileHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(replace_document_file_command_1.ReplaceDocumentFileCommand),
    tslib_1.__metadata("design:paramtypes", [document_upload_service_1.DocumentUploadService])
], ReplaceDocumentFileHandler);
//# sourceMappingURL=replace-document-file.handler.js.map