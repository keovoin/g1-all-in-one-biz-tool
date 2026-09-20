"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentVersionsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const document_version_service_1 = require("../../services/document-version.service");
const get_document_versions_query_1 = require("../get-document-versions.query");
let GetDocumentVersionsHandler = class GetDocumentVersionsHandler {
    constructor(documentService, documentVersionService) {
        this.documentService = documentService;
        this.documentVersionService = documentVersionService;
    }
    /**
     * Handles the `GetDocumentVersionsQuery`: paginated version history, newest first — the
     * list projection never returns content columns.
     *
     * @param query - The query carrying the document id and pagination.
     * @returns Paginated version list projections.
     */
    async execute(query) {
        const document = await this.documentService.findOneScoped(query.id);
        return this.documentVersionService.getVersions(document, query.params);
    }
};
exports.GetDocumentVersionsHandler = GetDocumentVersionsHandler;
exports.GetDocumentVersionsHandler = GetDocumentVersionsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_versions_query_1.GetDocumentVersionsQuery),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_version_service_1.DocumentVersionService])
], GetDocumentVersionsHandler);
//# sourceMappingURL=get-document-versions.handler.js.map