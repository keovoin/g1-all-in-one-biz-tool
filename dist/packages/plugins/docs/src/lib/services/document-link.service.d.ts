import { BaseEntityEnum, ID, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { CreateDocumentLinkDTO } from '../dto';
import { DocumentLink } from '../entities/document-link.entity';
import { MikroOrmDocumentLinkRepository } from '../repositories/mikro-orm-document-link.repository';
import { TypeOrmDocumentLinkRepository } from '../repositories/type-orm-document-link.repository';
import { DocumentService } from './document.service';
export declare class DocumentLinkService extends TenantAwareCrudService<DocumentLink> {
    readonly typeOrmDocumentLinkRepository: TypeOrmDocumentLinkRepository;
    readonly mikroOrmDocumentLinkRepository: MikroOrmDocumentLinkRepository;
    private readonly documentService;
    private readonly logger;
    constructor(typeOrmDocumentLinkRepository: TypeOrmDocumentLinkRepository, mikroOrmDocumentLinkRepository: MikroOrmDocumentLinkRepository, documentService: DocumentService);
    /**
     * Idempotent link write on `(documentId, entity, entityId)` — a duplicate returns the
     * existing row.
     *
     * @param input The link payload.
     * @returns The created (or pre-existing) link.
     */
    createLink(input: CreateDocumentLinkDTO): Promise<DocumentLink>;
    /**
     * The "Documents panel" reverse lookup: every link attached to one business record, with a
     * **list-safe** projection of the document relation.
     *
     * The link rows are only as private as the documents behind them, so the joined document is
     * put through the exact same gate as the document list itself: organization scope on both
     * sides of the join plus `DocumentService.applyVisibilityScope()` (visibility OR ownership
     * OR `DOCS_MANAGE` OR a share grant). Content columns (`contentJson`, `contentHtml`,
     * `extractedText`, `contentBinary`) and the storage key are never projected here — the
     * panel needs metadata, and `fileUrl` is resolved from `storageKey` by the subscriber, so
     * withholding the column withholds the URL too.
     *
     * @param entity The target record type.
     * @param entityId The target record id.
     * @param organizationId Organization scope (falls back to the requester's current org).
     * @returns The matching links.
     */
    getLinksForEntity(entity: BaseEntityEnum, entityId: ID, organizationId?: ID): Promise<IPagination<DocumentLink>>;
    /**
     * Forward lookup: everything one document is attached to.
     *
     * The document itself is resolved through the read scope first — otherwise the mere
     * *existence* (and count) of links and attachments on someone else's PRIVATE document, or
     * on another organization's document, would leak through this endpoint.
     *
     * @param documentId The document id.
     * @param organizationId Explicit organization scope for the document read (falls back to the
     * requester's current organization when omitted).
     * @returns The matching links.
     */
    getLinksForDocument(documentId: ID, organizationId?: ID): Promise<IPagination<DocumentLink>>;
    /**
     * Soft-deletes a link.
     *
     * @param id The link id.
     * @returns The soft-deleted link.
     */
    deleteLink(id: ID): Promise<DocumentLink>;
    /**
     * Builds the shared, fully-scoped link query: tenant + organization on the link row, an
     * `INNER JOIN` to the document (so a link whose document is out of scope disappears
     * entirely), the same organization scope on the joined document, the visibility/share
     * predicate, and the list-safe document projection.
     *
     * @param organizationId Organization scope (falls back to the requester's current org).
     * @returns The scoped query builder.
     */
    private buildScopedLinkQuery;
    /**
     * Serializes the metadata JSON for persistence on the SQLite path (the plain-text `json`
     * column) — per spec, this entity has no subscriber, the owning service round-trips.
     */
    private serializeMetadata;
    /**
     * Parses metadata back into an object on the SQLite path.
     */
    private withParsedMetadata;
}
