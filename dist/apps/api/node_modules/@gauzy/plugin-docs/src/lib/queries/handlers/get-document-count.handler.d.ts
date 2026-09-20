import { IQueryHandler } from '@nestjs/cqrs';
import { DocumentService } from '../../services/document.service';
import { GetDocumentCountQuery } from '../get-document-count.query';
export declare class GetDocumentCountHandler implements IQueryHandler<GetDocumentCountQuery> {
    private readonly documentService;
    constructor(documentService: DocumentService);
    /**
     * Handles the `GetDocumentCountQuery`: count for the same filter set as the list.
     *
     * @param query - The query carrying the filter set.
     * @returns The matching row count.
     */
    execute(query: GetDocumentCountQuery): Promise<number>;
}
