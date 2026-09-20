import { IQueryHandler } from '@nestjs/cqrs';
import { IDocumentLink, IPagination } from '@gauzy/contracts';
import { DocumentLinkService } from '../../services/document-link.service';
import { GetDocumentLinksQuery } from '../get-document-links.query';
export declare class GetDocumentLinksHandler implements IQueryHandler<GetDocumentLinksQuery> {
    private readonly documentLinkService;
    constructor(documentLinkService: DocumentLinkService);
    /**
     * Handles the `GetDocumentLinksQuery`, serving both directions: links attached to one
     * business record (`entity` + `entityId`) or everything one document is attached to.
     *
     * @param query - The query carrying the direction filter.
     * @returns The matching links.
     */
    execute(query: GetDocumentLinksQuery): Promise<IPagination<IDocumentLink>>;
}
