import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentTreeService } from '../../services/document-tree.service';
import { RecoverDocumentCommand } from '../recover-document.command';
export declare class RecoverDocumentHandler implements ICommandHandler<RecoverDocumentCommand> {
    private readonly documentService;
    private readonly documentTreeService;
    constructor(documentService: DocumentService, documentTreeService: DocumentTreeService);
    /**
     * Handles the `RecoverDocumentCommand`: restores a soft-deleted document (re-parented to
     * root if the original parent is still deleted); the document returns in archived state.
     *
     * The trashed row is resolved through the full read scope first (tenant + organization +
     * visibility/ownership/share), so an id from another organization — or someone else's
     * PRIVATE document — is a 404 and is never un-deleted or returned.
     *
     * @param command - The command carrying the id.
     * @returns The recovered document.
     */
    execute(command: RecoverDocumentCommand): Promise<IDocument>;
}
