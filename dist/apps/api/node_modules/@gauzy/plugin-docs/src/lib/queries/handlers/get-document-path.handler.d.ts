import { IQueryHandler } from '@nestjs/cqrs';
import { DocumentPathService, IDocumentPathSegment } from '../../services/document-path.service';
import { GetDocumentPathQuery } from '../get-document-path.query';
export declare class GetDocumentPathHandler implements IQueryHandler<GetDocumentPathQuery> {
    private readonly documentPathService;
    constructor(documentPathService: DocumentPathService);
    /**
     * Handles the `GetDocumentPathQuery`: the breadcrumb chain root → document, with every
     * ancestor the requester cannot read masked as `{ id: null, restricted: true }`.
     *
     * @param query - The query carrying the document id.
     * @returns The breadcrumb segments.
     */
    execute(query: GetDocumentPathQuery): Promise<IDocumentPathSegment[]>;
}
