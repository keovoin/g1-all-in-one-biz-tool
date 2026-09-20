import { IQueryHandler } from '@nestjs/cqrs';
import { IDocumentVersion } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentVersionService } from '../../services/document-version.service';
import { GetDocumentVersionQuery } from '../get-document-version.query';
export declare class GetDocumentVersionHandler implements IQueryHandler<GetDocumentVersionQuery> {
    private readonly documentService;
    private readonly documentVersionService;
    constructor(documentService: DocumentService, documentVersionService: DocumentVersionService);
    /**
     * Handles the `GetDocumentVersionQuery`: one full snapshot incl. content columns.
     *
     * @param query - The query carrying the document and version ids.
     * @returns The full snapshot.
     */
    execute(query: GetDocumentVersionQuery): Promise<IDocumentVersion>;
}
