"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDocumentLinksQuery = void 0;
/**
 * Serves both link list directions: by business record (`entity` + `entityId`) or by document
 * (`documentId`).
 */
class GetDocumentLinksQuery {
    constructor(filter) {
        this.filter = filter;
    }
}
exports.GetDocumentLinksQuery = GetDocumentLinksQuery;
GetDocumentLinksQuery.type = '[Document Links] Get All';
//# sourceMappingURL=get-document-links.query.js.map