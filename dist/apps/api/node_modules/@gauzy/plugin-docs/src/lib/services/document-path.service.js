"use strict";
var DocumentPathService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentPathService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const document_access_service_1 = require("./document-access.service");
const document_service_1 = require("./document.service");
/** Hard ceiling on the ancestor walk — a malformed cycle must never spin the request. */
const MAX_PATH_DEPTH = 64;
/**
 * Resolves the breadcrumb chain of a document server-side (`08-permissions-security.md` §3.2).
 *
 * Ancestor-gated navigation and the visibility rule pull in opposite directions: a document is
 * reachable by id on its own visibility, but the *names of its ancestors* are not — a PRIVATE
 * folder's name is exactly the kind of metadata §3.2 forbids leaking. Resolving the chain in the
 * client from the `parent` relation cannot honour that (the client would need every ancestor row
 * to decide), so the walk lives here: each ancestor is loaded within the tenant + organization
 * scope only, then put through {@link DocumentAccessService.canRead} individually, and an
 * unreadable one collapses to `{ id: null, restricted: true }`.
 */
let DocumentPathService = DocumentPathService_1 = class DocumentPathService {
    constructor(documentService, documentAccessService, typeOrmDocumentRepository) {
        this.documentService = documentService;
        this.documentAccessService = documentAccessService;
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.logger = new common_1.Logger(DocumentPathService_1.name);
    }
    /**
     * Resolves the breadcrumb of one document, root first, **including the document itself** as
     * the last segment (the shape `DocumentTreeStore.pathOf()` already produces client-side).
     *
     * The target is loaded through the normal read scope, so an id outside the caller's
     * tenant/organization/visibility is a 404 here exactly as it is on `GET /documents/:id` — the
     * endpoint never becomes an existence oracle.
     *
     * @param id The document whose path to resolve.
     * @returns The breadcrumb segments, root → document.
     */
    async getPath(id) {
        const document = await this.documentService.findOneScoped(id);
        const segments = [
            { id: document.id, name: document.name, kind: document.kind }
        ];
        const tenantId = core_1.RequestContext.currentTenantId();
        const seen = new Set([document.id]);
        let parentId = document.parentId ?? null;
        let depth = 0;
        while (parentId && depth++ < MAX_PATH_DEPTH) {
            if (seen.has(parentId)) {
                // A cycle can only exist through a bad write; report what resolved and stop.
                this.logger.warn(`Document path walk hit a cycle at ${parentId} (document ${document.id})`);
                break;
            }
            seen.add(parentId);
            // Tenant + organization scope only — readability is decided per segment below, so
            // the visibility predicate must NOT prune the row before it can be masked.
            const ancestor = await this.typeOrmDocumentRepository.findOne({
                where: { id: parentId, tenantId, organizationId: document.organizationId },
                select: {
                    id: true,
                    name: true,
                    kind: true,
                    parentId: true,
                    visibility: true,
                    createdByUserId: true
                }
            });
            if (!ancestor) {
                break; // dangling parent id — the chain simply ends here
            }
            const readable = await this.documentAccessService.canRead({ createdByUserId: ancestor.createdByUserId, visibility: ancestor.visibility }, ancestor.id);
            segments.unshift(readable ? { id: ancestor.id, name: ancestor.name, kind: ancestor.kind } : { id: null, restricted: true });
            parentId = ancestor.parentId ?? null;
        }
        return segments;
    }
};
exports.DocumentPathService = DocumentPathService;
exports.DocumentPathService = DocumentPathService = DocumentPathService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [document_service_1.DocumentService,
        document_access_service_1.DocumentAccessService,
        type_orm_document_repository_1.TypeOrmDocumentRepository])
], DocumentPathService);
//# sourceMappingURL=document-path.service.js.map