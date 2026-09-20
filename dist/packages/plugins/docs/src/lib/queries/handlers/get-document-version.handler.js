"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentVersionHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_version_service_1 = require("../../services/document-version.service");
const get_document_version_query_1 = require("../get-document-version.query");
let GetDocumentVersionHandler = class GetDocumentVersionHandler {
    constructor(documentService, documentVersionService) {
        this.documentService = documentService;
        this.documentVersionService = documentVersionService;
    }
    /**
     * Handles the `GetDocumentVersionQuery`: one full snapshot incl. content columns.
     *
     * @param query - The query carrying the document and version ids.
     * @returns The full snapshot.
     */
    async execute(query) {
        const document = await this.documentService.findOneScoped(query.id);
        return this.documentVersionService.getVersion(document, query.versionId);
    }
};
exports.GetDocumentVersionHandler = GetDocumentVersionHandler;
exports.GetDocumentVersionHandler = GetDocumentVersionHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_version_query_1.GetDocumentVersionQuery),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_version_service_1.DocumentVersionService])
], GetDocumentVersionHandler);
//# sourceMappingURL=get-document-version.handler.js.map