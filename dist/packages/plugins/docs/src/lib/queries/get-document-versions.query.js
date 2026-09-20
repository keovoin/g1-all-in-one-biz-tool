"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentVersionsQuery = void 0;
class GetDocumentVersionsQuery {
    // Pagination only. This deliberately is NOT a `BaseQueryDTO`: that family inherits an
    // `@IsNotEmpty()` `where`, which made the route reject every request, and no code on this path
    // ever read it — the scope comes from the document named in the route.
    constructor(id, params) {
        this.id = id;
        this.params = params;
    }
}
exports.GetDocumentVersionsQuery = GetDocumentVersionsQuery;
GetDocumentVersionsQuery.type = '[Document Versions] Get All';
//# sourceMappingURL=get-document-versions.query.js.map