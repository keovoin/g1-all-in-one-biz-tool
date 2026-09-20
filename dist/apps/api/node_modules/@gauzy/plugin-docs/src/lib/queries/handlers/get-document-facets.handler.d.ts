import { IQueryHandler } from '@nestjs/cqrs';
import { DocumentService } from '../../services/document.service';
import { GetDocumentFacetsQuery } from '../get-document-facets.query';
export declare class GetDocumentFacetsHandler implements IQueryHandler<GetDocumentFacetsQuery> {
    private readonly documentService;
    constructor(documentService: DocumentService);
    /**
     * Handles the `GetDocumentFacetsQuery`: facet counts for the filter chips (each bucket
     * computed over the *other* filters).
     *
     * @param query - The query carrying the filter set.
     * @returns The facet-count envelope.
     */
    execute(query: GetDocumentFacetsQuery): Promise<Record<string, any>>;
}
