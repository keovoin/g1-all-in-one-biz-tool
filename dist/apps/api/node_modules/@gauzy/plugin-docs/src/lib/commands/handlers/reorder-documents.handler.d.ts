import { ICommandHandler } from '@nestjs/cqrs';
import { DocumentTreeService } from '../../services/document-tree.service';
import { ReorderDocumentsCommand } from '../reorder-documents.command';
export declare class ReorderDocumentsHandler implements ICommandHandler<ReorderDocumentsCommand> {
    private readonly documentTreeService;
    constructor(documentTreeService: DocumentTreeService);
    /**
     * Handles the `ReorderDocumentsCommand`: rewrites `index` for the listed siblings.
     *
     * @param command - The command carrying the parent and ordered sibling ids.
     */
    execute(command: ReorderDocumentsCommand): Promise<void>;
}
