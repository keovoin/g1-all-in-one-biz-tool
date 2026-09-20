import { ID, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { CreateDocumentShareDTO, UpdateDocumentShareDTO } from '../dto/document-share.dto';
import { DocumentShare } from '../entities/document-share.entity';
import { MikroOrmDocumentShareRepository } from '../repositories/mikro-orm-document-share.repository';
import { TypeOrmDocumentShareRepository } from '../repositories/type-orm-document-share.repository';
import { DocumentAccessService } from './document-access.service';
import { DocumentService } from './document.service';
/**
 * CRUD for the `DocumentShare` overlay (`03-backend-plugin.md` §4.12,
 * `08-permissions-security.md` §3.3).
 *
 * Rules enforced here — the route guard only proves the verb (`DOCS_READ` / `DOCS_UPDATE`):
 *
 * - The target document must be **readable** by the caller, else 404 (no existence oracle) —
 *   `DocumentService.findOneScoped` does that, share overlay included.
 * - Only the document's **creator** or a **`DOCS_MANAGE`** holder may list or mutate the
 *   overlay (403 `DOCS_SHARE_FORBIDDEN`). A grantee — even at `EDIT` — can never re-share.
 * - Shares are meaningful on `visibility: PRIVATE` documents only → 409
 *   `DOCS_SHARE_NOT_PRIVATE` on an ORGANIZATION document.
 * - Exactly one of `employeeId` / `teamId` → 400 `DOCS_SHARE_TARGET`.
 * - One row per (document, target) → 409 `DOCS_SHARE_EXISTS`.
 */
export declare class DocumentShareService extends TenantAwareCrudService<DocumentShare> {
    readonly typeOrmDocumentShareRepository: TypeOrmDocumentShareRepository;
    readonly mikroOrmDocumentShareRepository: MikroOrmDocumentShareRepository;
    private readonly documentService;
    private readonly documentAccessService;
    private readonly logger;
    constructor(typeOrmDocumentShareRepository: TypeOrmDocumentShareRepository, mikroOrmDocumentShareRepository: MikroOrmDocumentShareRepository, documentService: DocumentService, documentAccessService: DocumentAccessService);
    /**
     * Lists the share overlay of one document.
     *
     * @param documentId The document whose overlay to read.
     * @returns The share rows with their employee/team relations.
     */
    findAllForDocument(documentId: ID): Promise<IPagination<DocumentShare>>;
    /**
     * Creates one share row.
     *
     * @param documentId The (PRIVATE) document to share.
     * @param input The grantee + access level.
     * @returns The created share row.
     */
    createShare(documentId: ID, input: CreateDocumentShareDTO): Promise<DocumentShare>;
    /**
     * Updates the access level of one share row.
     *
     * @param documentId The document owning the row.
     * @param shareId The share row id.
     * @param input The new access level.
     * @returns The updated share row.
     */
    updateShare(documentId: ID, shareId: ID, input: UpdateDocumentShareDTO): Promise<DocumentShare>;
    /**
     * Revokes one share row (soft delete — the affected row is returned, per the plugin's
     * "no 204s" convention).
     *
     * @param documentId The document owning the row.
     * @param shareId The share row id.
     * @returns The revoked share row.
     */
    deleteShare(documentId: ID, shareId: ID): Promise<DocumentShare>;
    /**
     * Loads the target document through the read scope (404 when not readable) and asserts
     * that the caller may administer its overlay (403 otherwise).
     *
     * @param documentId The document id.
     * @returns The document.
     */
    private assertCanAdminister;
    /**
     * Loads one share row scoped to its document (a share id from another document is a 404).
     *
     * @param documentId The owning document id.
     * @param shareId The share row id.
     * @returns The share row.
     */
    private findShareOrFail;
}
