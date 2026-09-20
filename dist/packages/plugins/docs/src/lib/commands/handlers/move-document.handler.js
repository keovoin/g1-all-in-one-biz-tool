"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_tree_service_1 = require("../../services/document-tree.service");
const move_document_command_1 = require("../move-document.command");
let MoveDocumentHandler = class MoveDocumentHandler {
    constructor(documentService, documentTreeService) {
        this.documentService = documentService;
        this.documentTreeService = documentTreeService;
    }
    /**
     * Handles the `MoveDocumentCommand`: re-parents a node (cycle-guarded) and compacts the
     * sibling `index` values.
     *
     * @param command - The command carrying the id and move payload.
     * @returns The moved document.
     */
    async execute(command) {
        const document = await this.documentService.findOneScoped(command.id);
        await this.documentService.assertCanWrite(document);
        const previousParentId = document.parentId ?? null;
        const moved = await this.documentTreeService.moveDocument(document, command.input.parentId, command.input.index);
        // `field` + before/after so the activity timeline records the re-parenting (R-COL-03),
        // not just "the document was updated".
        this.documentService.emitDocumentEvent(moved, 'updated', {
            phase: 'crud',
            field: 'parentId',
            previous: previousParentId ?? 'root',
            next: moved.parentId ?? 'root'
        });
        return moved;
    }
};
exports.MoveDocumentHandler = MoveDocumentHandler;
exports.MoveDocumentHandler = MoveDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(move_document_command_1.MoveDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_tree_service_1.DocumentTreeService])
], MoveDocumentHandler);
//# sourceMappingURL=move-document.handler.js.map