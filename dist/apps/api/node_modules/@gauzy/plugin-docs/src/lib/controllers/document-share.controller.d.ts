import { ID, IDocumentShare, IPagination } from '@gauzy/contracts';
import { CreateDocumentShareDTO, UpdateDocumentShareDTO } from '../dto/document-share.dto';
import { DocumentShareService } from '../services/document-share.service';
/**
 * The share overlay of PRIVATE documents (`03-backend-plugin.md` §4.12).
 *
 * Guards prove the verb (`DOCS_READ` to list, `DOCS_UPDATE` to mutate); the service proves
 * the verb is allowed on this row — creator-or-`DOCS_MANAGE` only, PRIVATE documents only.
 * A document the caller cannot read is a 404, never a 403.
 */
export declare class DocumentShareController {
    private readonly documentShareService;
    constructor(documentShareService: DocumentShareService);
    /**
     * Lists the share overlay of one document (creator / `DOCS_MANAGE` only).
     */
    findAll(id: ID): Promise<IPagination<IDocumentShare>>;
    /**
     * Shares a PRIVATE document with one employee XOR one team.
     */
    create(id: ID, input: CreateDocumentShareDTO): Promise<IDocumentShare>;
    /**
     * Changes the access level of one share row.
     */
    update(id: ID, shareId: ID, input: UpdateDocumentShareDTO): Promise<IDocumentShare>;
    /**
     * Revokes one share row.
     */
    delete(id: ID, shareId: ID): Promise<IDocumentShare>;
}
