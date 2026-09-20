"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const get_document_query_1 = require("../get-document.query");
let GetDocumentHandler = class GetDocumentHandler {
    constructor(documentService) {
        this.documentService = documentService;
    }
    /**
     * Handles the `GetDocumentQuery`: single document with optional relations, tenant/org +
     * visibility scoped (invisible ids resolve to 404, never 403). An explicit `organizationId`
     * (the client's selected organization) wins over the request context's.
     *
     * @param query - The query carrying the id, relations and optional organization scope.
     * @returns The scoped document.
     */
    async execute(query) {
        return this.documentService.findOneScoped(query.id, query.relations, query.organizationId);
    }
};
exports.GetDocumentHandler = GetDocumentHandler;
exports.GetDocumentHandler = GetDocumentHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_query_1.GetDocumentQuery),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService])
], GetDocumentHandler);
//# sourceMappingURL=get-document.handler.js.map