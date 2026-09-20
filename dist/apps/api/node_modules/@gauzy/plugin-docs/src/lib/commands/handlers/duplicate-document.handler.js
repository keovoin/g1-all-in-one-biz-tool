"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_tree_service_1 = require("../../services/document-tree.service");
const duplicate_document_command_1 = require("../duplicate-document.command");
let DuplicateDocumentHandler = class DuplicateDocumentHandler {
    constructor(documentService, documentTreeService) {
        this.documentService = documentService;
        this.documentTreeService = documentTreeService;
    }
    /**
     * Handles the `DuplicateDocumentCommand`: copies a node (optionally its subtree); the copy
     * starts `knowledgeStatus: NONE`, `reviewStatus: NONE`.
     *
     * Reading the source needs read access only, but writing the copy **into** a target parent
     * is a mutation of that parent's subtree — so an explicit `parentId` is resolved through
     * the read scope and must additionally be writable by the caller.
     *
     * @param command - The command carrying the id and duplicate options.
     * @returns The new root node of the copy.
     */
    async execute(command) {
        const document = await this.documentService.findOneScoped(command.id);
        if (command.input?.parentId) {
            const parent = await this.documentService.findOneScoped(command.input.parentId);
            await this.documentService.assertCanWrite(parent);
        }
        const copy = await this.documentTreeService.duplicateDocument(document, command.input);
        this.documentService.emitDocumentEvent(copy, 'created');
        return copy;
    }
};
exports.DuplicateDocumentHandler = DuplicateDocumentHandler;
exports.DuplicateDocumentHandler = DuplicateDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(duplicate_document_command_1.DuplicateDocumentCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_tree_service_1.DocumentTreeService])
], DuplicateDocumentHandler);
//# sourceMappingURL=duplicate-document.handler.js.map