"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_tree_service_1 = require("../../services/document-tree.service");
const archive_document_command_1 = require("../archive-document.command");
let ArchiveDocumentHandler = class ArchiveDocumentHandler {
    constructor(documentService, documentTreeService) {
        this.documentService = documentService;
        this.documentTreeService = documentTreeService;
    }
    /**
     * Handles the `ArchiveDocumentCommand`: archives the node and cascades to the whole
     * subtree. Idempotent.
     *
     * @param command - The command carrying the id.
     * @returns The archived document.
     */
    async execute(command) {
        const document = await this.documentService.findOneScoped(command.id);
        await this.documentService.assertCanWrite(document);
        const wasArchived = document.isArchived === true;
        await this.documentTreeService.archiveSubtree(document);
        const archived = await this.documentService.findOneScoped(command.id);
        // `field` + before/after so the activity timeline records the archive (R-COL-03).
        this.documentService.emitDocumentEvent(archived, 'updated', {
            phase: 'crud',
            field: 'isArchived',
            previous: String(wasArchived),
            next: String(archived.isArchived === true)
        });
        return archived;
    }
};
exports.ArchiveDocumentHandler = ArchiveDocumentHandler;
exports.ArchiveDocumentHandler = ArchiveDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(archive_document_command_1.ArchiveDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_tree_service_1.DocumentTreeService])
], ArchiveDocumentHandler);
//# sourceMappingURL=archive-document.handler.js.map