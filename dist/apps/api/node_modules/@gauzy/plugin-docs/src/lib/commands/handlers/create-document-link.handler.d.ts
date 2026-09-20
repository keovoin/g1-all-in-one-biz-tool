import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentLink } from '@gauzy/contracts';
import { DocumentLinkService } from '../../services/document-link.service';
import { CreateDocumentLinkCommand } from '../create-document-link.command';
export declare class CreateDocumentLinkHandler implements ICommandHandler<CreateDocumentLinkCommand> {
    private readonly documentLinkService;
    constructor(documentLinkService: DocumentLinkService);
    /**
     * Handles the `CreateDocumentLinkCommand`: idempotent link write on
     * `(documentId, entity, entityId)` — a duplicate returns the existing row.
     *
     * @param command - The command carrying the link payload.
     * @returns The created (or pre-existing) link.
     */
    execute(command: CreateDocumentLinkCommand): Promise<IDocumentLink>;
}
