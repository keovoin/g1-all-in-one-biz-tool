import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentTreeService } from '../../services/document-tree.service';
import { MoveDocumentCommand } from '../move-document.command';
export declare class MoveDocumentHandler implements ICommandHandler<MoveDocumentCommand> {
    private readonly documentService;
    private readonly documentTreeService;
    constructor(documentService: DocumentService, documentTreeService: DocumentTreeService);
    /**
     * Handles the `MoveDocumentCommand`: re-parents a node (cycle-guarded) and compacts the
     * sibling `index` values.
     *
     * @param command - The command carrying the id and move payload.
     * @returns The moved document.
     */
    execute(command: MoveDocumentCommand): Promise<IDocument>;
}
