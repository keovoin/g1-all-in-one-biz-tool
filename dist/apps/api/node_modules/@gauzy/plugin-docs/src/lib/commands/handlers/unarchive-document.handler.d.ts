import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentTreeService } from '../../services/document-tree.service';
import { UnarchiveDocumentCommand } from '../unarchive-document.command';
export declare class UnarchiveDocumentHandler implements ICommandHandler<UnarchiveDocumentCommand> {
    private readonly documentService;
    private readonly documentTreeService;
    constructor(documentService: DocumentService, documentTreeService: DocumentTreeService);
    /**
     * Handles the `UnarchiveDocumentCommand`: clears the archive flags on the subtree (plus any
     * archived ancestors needed for reachability). Idempotent.
     *
     * @param command - The command carrying the id.
     * @returns The unarchived document.
     */
    execute(command: UnarchiveDocumentCommand): Promise<IDocument>;
}
