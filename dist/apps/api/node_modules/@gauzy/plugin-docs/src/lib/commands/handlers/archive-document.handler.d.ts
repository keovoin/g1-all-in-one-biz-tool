import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentTreeService } from '../../services/document-tree.service';
import { ArchiveDocumentCommand } from '../archive-document.command';
export declare class ArchiveDocumentHandler implements ICommandHandler<ArchiveDocumentCommand> {
    private readonly documentService;
    private readonly documentTreeService;
    constructor(documentService: DocumentService, documentTreeService: DocumentTreeService);
    /**
     * Handles the `ArchiveDocumentCommand`: archives the node and cascades to the whole
     * subtree. Idempotent.
     *
     * @param command - The command carrying the id.
     * @returns The archived document.
     */
    execute(command: ArchiveDocumentCommand): Promise<IDocument>;
}
