"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentFacetsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const get_document_facets_query_1 = require("../get-document-facets.query");
let GetDocumentFacetsHandler = class GetDocumentFacetsHandler {
    constructor(documentService) {
        this.documentService = documentService;
    }
    /**
     * Handles the `GetDocumentFacetsQuery`: facet counts for the filter chips (each bucket
     * computed over the *other* filters).
     *
     * @param query - The query carrying the filter set.
     * @returns The facet-count envelope.
     */
    async execute(query) {
        return this.documentService.getDocumentFacets(query.params);
    }
};
exports.GetDocumentFacetsHandler = GetDocumentFacetsHandler;
exports.GetDocumentFacetsHandler = GetDocumentFacetsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_facets_query_1.GetDocumentFacetsQuery),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService])
], GetDocumentFacetsHandler);
//# sourceMappingURL=get-document-facets.handler.js.map