"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentCountHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const document_service_1 = require("../../services/document.service");
const get_document_count_query_1 = require("../get-document-count.query");
let GetDocumentCountHandler = class GetDocumentCountHandler {
    constructor(documentService) {
        this.documentService = documentService;
    }
    /**
     * Handles the `GetDocumentCountQuery`: count for the same filter set as the list.
     *
     * @param query - The query carrying the filter set.
     * @returns The matching row count.
     */
    async execute(query) {
        return this.documentService.getDocumentCount(query.params);
    }
};
exports.GetDocumentCountHandler = GetDocumentCountHandler;
exports.GetDocumentCountHandler = GetDocumentCountHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_document_count_query_1.GetDocumentCountQuery),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService])
], GetDocumentCountHandler);
//# sourceMappingURL=get-document-count.handler.js.map