import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { UpdateDocumentCommand } from '../update-document.command';
export declare class UpdateDocumentHandler implements ICommandHandler<UpdateDocumentCommand> {
    private readonly documentService;
    constructor(documentService: DocumentService);
    /**
     * Handles the `UpdateDocumentCommand`: partial metadata-only update.
     *
     * @param command - The command carrying the id and update payload.
     * @returns The updated document.
     */
    execute(command: UpdateDocumentCommand): Promise<IDocument>;
}
