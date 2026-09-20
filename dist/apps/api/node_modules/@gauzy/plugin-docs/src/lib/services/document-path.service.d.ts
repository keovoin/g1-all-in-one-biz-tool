import { DocumentKindEnum, ID } from '@gauzy/contracts';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentAccessService } from './document-access.service';
import { DocumentService } from './document.service';
/**
 * One segment of a document's breadcrumb.
 *
 * A segment the requester may not read is masked: `id: null`, `restricted: true`, and **no other
 * field at all** — not the name, not the kind, not the parent id. That is the whole point of the
 * masking rule in `08-permissions-security.md` §3.2 ("masked segments render as a lock chip with
 * no name, id, or link"), and it is why the resolution happens here rather than in the client from
 * a `?relations=parent` join.
 */
export interface IDocumentPathSegment {
    id: ID | null;
    name?: string;
    kind?: DocumentKindEnum;
    restricted?: boolean;
}
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
export declare class DocumentPathService {
    private readonly documentService;
    private readonly documentAccessService;
    private readonly typeOrmDocumentRepository;
    private readonly logger;
    constructor(documentService: DocumentService, documentAccessService: DocumentAccessService, typeOrmDocumentRepository: TypeOrmDocumentRepository);
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
    getPath(id: ID): Promise<IDocumentPathSegment[]>;
}
