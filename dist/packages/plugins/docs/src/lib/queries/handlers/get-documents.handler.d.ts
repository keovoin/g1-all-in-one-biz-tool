import { IQueryHandler } from '@nestjs/cqrs';
import { IDocument, IPagination } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { GetDocumentsQuery } from '../get-documents.query';
export declare class GetDocumentsHandler implements IQueryHandler<GetDocumentsQuery> {
    private readonly documentService;
    constructor(documentService: DocumentService);
    /**
     * Handles the `GetDocumentsQuery`: paginated, filtered list (content columns never selected).
     *
     * @param query - The query carrying the filter set.
     * @returns Paginated documents with the list projection markers.
     */
    execute(query: GetDocumentsQuery): Promise<IPagination<IDocument>>;
}
