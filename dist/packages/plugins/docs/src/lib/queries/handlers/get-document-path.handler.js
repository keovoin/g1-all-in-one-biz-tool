"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentPathHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_path_service_1 = require("../../services/document-path.service");
const get_document_path_query_1 = require("../get-document-path.query");
let GetDocumentPathHandler = class GetDocumentPathHandler {
    constructor(documentPathService) {
        this.documentPathService = documentPathService;
    }
    /**
     * Handles the `GetDocumentPathQuery`: the breadcrumb chain root → document, with every
     * ancestor the requester cannot read masked as `{ id: null, restricted: true }`.
     *
     * @param query - The query carrying the document id.
     * @returns The breadcrumb segments.
     */
    async execute(query) {
        return this.documentPathService.getPath(query.id);
    }
};
exports.GetDocumentPathHandler = GetDocumentPathHandler;
exports.GetDocumentPathHandler = GetDocumentPathHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_path_query_1.GetDocumentPathQuery),
    tslib_1.__metadata("design:paramtypes", [document_path_service_1.DocumentPathService])
], GetDocumentPathHandler);
//# sourceMappingURL=get-document-path.handler.js.map