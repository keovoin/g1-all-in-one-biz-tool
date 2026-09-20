"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExtractedTextHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_processing_service_1 = require("../../services/document-processing.service");
const update_extracted_text_command_1 = require("../update-extracted-text.command");
let UpdateExtractedTextHandler = class UpdateExtractedTextHandler {
    constructor(documentProcessingService) {
        this.documentProcessingService = documentProcessingService;
    }
    /**
     * Handles the `UpdateExtractedTextCommand`: the human correction flow — stores the
     * corrected markdown, sets the permanent `extractedTextEdited` guard, and re-enqueues
     * from `docs.chunk` when the document is in knowledge.
     *
     * @param command - The command carrying the document id and corrected text.
     * @returns The updated document.
     */
    async execute(command) {
        return this.documentProcessingService.updateExtractedText(command.id, command.input);
    }
};
exports.UpdateExtractedTextHandler = UpdateExtractedTextHandler;
exports.UpdateExtractedTextHandler = UpdateExtractedTextHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_extracted_text_command_1.UpdateExtractedTextCommand),
    tslib_1.__metadata("design:paramtypes", [document_processing_service_1.DocumentProcessingService])
], UpdateExtractedTextHandler);
//# sourceMappingURL=update-extracted-text.handler.js.map