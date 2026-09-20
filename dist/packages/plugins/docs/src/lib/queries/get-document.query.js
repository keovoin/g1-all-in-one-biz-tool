"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentQuery = void 0;
class GetDocumentQuery {
    constructor(id, relations = [], 
    /** Explicit organization scope; when omitted the service falls back to the request context. */
    organizationId) {
        this.id = id;
        this.relations = relations;
        this.organizationId = organizationId;
    }
}
exports.GetDocumentQuery = GetDocumentQuery;
GetDocumentQuery.type = '[Documents] Get One';
//# sourceMappingURL=get-document.query.js.map