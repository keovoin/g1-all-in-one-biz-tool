import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ID, IDocumentLink, IPagination } from '@gauzy/contracts';
import { CreateDocumentLinkDTO, DocumentScopeQueryDTO, GetDocumentLinksQueryDTO } from '../dto';
export declare class DocumentLinkController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * The "Documents panel" query for business records — every link attached to
     * (`entity`, `entityId`), with embedded document list projections.
     */
    findForEntity(query: GetDocumentLinksQueryDTO): Promise<IPagination<IDocumentLink>>;
    /**
     * Idempotent link write on `(documentId, entity, entityId)` — a duplicate returns the
     * existing row with 200.
     */
    create(input: CreateDocumentLinkDTO): Promise<IDocumentLink>;
    /**
     * Removes a link.
     */
    delete(id: ID): Promise<IDocumentLink>;
    /**
     * The reverse direction: everything one document is attached to.
     *
     * `organizationId` is the client's selected organization — the document read behind this
     * route otherwise falls back to the token's org, which is null for non-employee users (400)
     * and stale when the client browses another organization of the tenant (404).
     */
    findForDocument(id: ID, query?: DocumentScopeQueryDTO): Promise<IPagination<IDocumentLink>>;
}
