"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const get_documents_query_1 = require("../get-documents.query");
let GetDocumentsHandler = class GetDocumentsHandler {
    constructor(documentService) {
        this.documentService = documentService;
    }
    /**
     * Handles the `GetDocumentsQuery`: paginated, filtered list (content columns never selected).
     *
     * @param query - The query carrying the filter set.
     * @returns Paginated documents with the list projection markers.
     */
    async execute(query) {
        return this.documentService.getDocuments(query.params);
    }
};
exports.GetDocumentsHandler = GetDocumentsHandler;
exports.GetDocumentsHandler = GetDocumentsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_documents_query_1.GetDocumentsQuery),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService])
], GetDocumentsHandler);
//# sourceMappingURL=get-documents.handler.js.map