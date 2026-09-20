import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentTreeService } from '../../services/document-tree.service';
import { DuplicateDocumentCommand } from '../duplicate-document.command';
export declare class DuplicateDocumentHandler implements ICommandHandler<DuplicateDocumentCommand> {
    private readonly documentService;
    private readonly documentTreeService;
    constructor(documentService: DocumentService, documentTreeService: DocumentTreeService);
    /**
     * Handles the `DuplicateDocumentCommand`: copies a node (optionally its subtree); the copy
     * starts `knowledgeStatus: NONE`, `reviewStatus: NONE`.
     *
     * Reading the source needs read access only, but writing the copy **into** a target parent
     * is a mutation of that parent's subtree — so an explicit `parentId` is resolved through
     * the read scope and must additionally be writable by the caller.
     *
     * @param command - The command carrying the id and duplicate options.
     * @returns The new root node of the copy.
     */
    execute(command: DuplicateDocumentCommand): Promise<IDocument>;
}
