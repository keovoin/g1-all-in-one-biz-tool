"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReprocessDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_processing_service_1 = require("../../services/document-processing.service");
const reprocess_document_command_1 = require("../reprocess-document.command");
let ReprocessDocumentHandler = class ReprocessDocumentHandler {
    constructor(documentProcessingService) {
        this.documentProcessingService = documentProcessingService;
    }
    /**
     * Handles the `ReprocessDocumentCommand`: re-runs the pipeline from `docs.extract`
     * for a FILE document (409 when a human-edited extraction would be overwritten).
     *
     * @param command - The command carrying the document id and reprocess options.
     * @returns The document after the enqueue.
     */
    async execute(command) {
        return this.documentProcessingService.reprocess(command.id, command.input);
    }
};
exports.ReprocessDocumentHandler = ReprocessDocumentHandler;
exports.ReprocessDocumentHandler = ReprocessDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(reprocess_document_command_1.ReprocessDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_processing_service_1.DocumentProcessingService])
], ReprocessDocumentHandler);
//# sourceMappingURL=reprocess-document.handler.js.map