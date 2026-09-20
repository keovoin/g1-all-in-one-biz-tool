"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentLinksHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_link_service_1 = require("../../services/document-link.service");
const get_document_links_query_1 = require("../get-document-links.query");
let GetDocumentLinksHandler = class GetDocumentLinksHandler {
    constructor(documentLinkService) {
        this.documentLinkService = documentLinkService;
    }
    /**
     * Handles the `GetDocumentLinksQuery`, serving both directions: links attached to one
     * business record (`entity` + `entityId`) or everything one document is attached to.
     *
     * @param query - The query carrying the direction filter.
     * @returns The matching links.
     */
    async execute(query) {
        const { entity, entityId, documentId, organizationId } = query.filter;
        if (documentId) {
            return this.documentLinkService.getLinksForDocument(documentId, organizationId);
        }
        return this.documentLinkService.getLinksForEntity(entity, entityId, organizationId);
    }
};
exports.GetDocumentLinksHandler = GetDocumentLinksHandler;
exports.GetDocumentLinksHandler = GetDocumentLinksHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_links_query_1.GetDocumentLinksQuery),
    tslib_1.__metadata("design:paramtypes", [document_link_service_1.DocumentLinkService])
], GetDocumentLinksHandler);
//# sourceMappingURL=get-document-links.handler.js.map