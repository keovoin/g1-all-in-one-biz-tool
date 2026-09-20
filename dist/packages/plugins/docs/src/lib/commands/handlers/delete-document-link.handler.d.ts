import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentLink } from '@gauzy/contracts';
import { DocumentLinkService } from '../../services/document-link.service';
import { DeleteDocumentLinkCommand } from '../delete-document-link.command';
export declare class DeleteDocumentLinkHandler implements ICommandHandler<DeleteDocumentLinkCommand> {
    private readonly documentLinkService;
    constructor(documentLinkService: DocumentLinkService);
    /**
     * Handles the `DeleteDocumentLinkCommand`: soft-deletes a link.
     *
     * @param command - The command carrying the id.
     * @returns The soft-deleted link.
     */
    execute(command: DeleteDocumentLinkCommand): Promise<IDocumentLink>;
}
