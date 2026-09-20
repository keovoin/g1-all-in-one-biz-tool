import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentTreeService } from '../../services/document-tree.service';
import { DeleteDocumentCommand } from '../delete-document.command';
export declare class DeleteDocumentHandler implements ICommandHandler<DeleteDocumentCommand> {
    private readonly documentService;
    private readonly documentTreeService;
    constructor(documentService: DocumentService, documentTreeService: DocumentTreeService);
    /**
     * Handles the `DeleteDocumentCommand`: soft delete, allowed only from archived state
     * (archive-first workflow), with `subtree` or `promote-children` strategy.
     *
     * @param command - The command carrying the id and strategy.
     * @returns The soft-deleted document.
     */
    execute(command: DeleteDocumentCommand): Promise<IDocument>;
}
