"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnarchiveDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_tree_service_1 = require("../../services/document-tree.service");
const unarchive_document_command_1 = require("../unarchive-document.command");
let UnarchiveDocumentHandler = class UnarchiveDocumentHandler {
    constructor(documentService, documentTreeService) {
        this.documentService = documentService;
        this.documentTreeService = documentTreeService;
    }
    /**
     * Handles the `UnarchiveDocumentCommand`: clears the archive flags on the subtree (plus any
     * archived ancestors needed for reachability). Idempotent.
     *
     * @param command - The command carrying the id.
     * @returns The unarchived document.
     */
    async execute(command) {
        const document = await this.documentService.findOneScoped(command.id);
        await this.documentService.assertCanWrite(document);
        const wasArchived = document.isArchived === true;
        await this.documentTreeService.unarchiveSubtree(document);
        const unarchived = await this.documentService.findOneScoped(command.id);
        // `field` + before/after so the activity timeline records the unarchive (R-COL-03).
        this.documentService.emitDocumentEvent(unarchived, 'updated', {
            phase: 'crud',
            field: 'isArchived',
            previous: String(wasArchived),
            next: String(unarchived.isArchived === true)
        });
        return unarchived;
    }
};
exports.UnarchiveDocumentHandler = UnarchiveDocumentHandler;
exports.UnarchiveDocumentHandler = UnarchiveDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(unarchive_document_command_1.UnarchiveDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_tree_service_1.DocumentTreeService])
], UnarchiveDocumentHandler);
//# sourceMappingURL=unarchive-document.handler.js.map