import { IQueryHandler } from '@nestjs/cqrs';
import { IDocumentVersion, IPagination } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentVersionService } from '../../services/document-version.service';
import { GetDocumentVersionsQuery } from '../get-document-versions.query';
export declare class GetDocumentVersionsHandler implements IQueryHandler<GetDocumentVersionsQuery> {
    private readonly documentService;
    private readonly documentVersionService;
    constructor(documentService: DocumentService, documentVersionService: DocumentVersionService);
    /**
     * Handles the `GetDocumentVersionsQuery`: paginated version history, newest first — the
     * list projection never returns content columns.
     *
     * @param query - The query carrying the document id and pagination.
     * @returns Paginated version list projections.
     */
    execute(query: GetDocumentVersionsQuery): Promise<IPagination<IDocumentVersion>>;
}
