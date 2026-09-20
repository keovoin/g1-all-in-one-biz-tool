"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestoreDocumentVersionHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_version_service_1 = require("../../services/document-version.service");
const restore_document_version_command_1 = require("../restore-document-version.command");
let RestoreDocumentVersionHandler = class RestoreDocumentVersionHandler {
    constructor(documentService, documentVersionService) {
        this.documentService = documentService;
        this.documentVersionService = documentVersionService;
    }
    /**
     * Handles the `RestoreDocumentVersionCommand`: **non-destructive** restore — first snapshots
     * the current content as a new version, then copies the target snapshot onto the document.
     *
     * @param command - The command carrying the document and version ids.
     * @returns The updated document.
     */
    async execute(command) {
        const document = await this.documentService.findOneScoped(command.id);
        const restored = await this.documentVersionService.restoreVersion(document, command.versionId);
        this.documentService.emitDocumentEvent(restored, 'updated');
        return restored;
    }
};
exports.RestoreDocumentVersionHandler = RestoreDocumentVersionHandler;
exports.RestoreDocumentVersionHandler = RestoreDocumentVersionHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(restore_document_version_command_1.RestoreDocumentVersionCommand),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_version_service_1.DocumentVersionService])
], RestoreDocumentVersionHandler);
//# sourceMappingURL=restore-document-version.handler.js.map