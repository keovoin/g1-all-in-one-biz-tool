import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentProcessingService } from '../../services/document-processing.service';
import { UpdateExtractedTextCommand } from '../update-extracted-text.command';
export declare class UpdateExtractedTextHandler implements ICommandHandler<UpdateExtractedTextCommand> {
    private readonly documentProcessingService;
    constructor(documentProcessingService: DocumentProcessingService);
    /**
     * Handles the `UpdateExtractedTextCommand`: the human correction flow — stores the
     * corrected markdown, sets the permanent `extractedTextEdited` guard, and re-enqueues
     * from `docs.chunk` when the document is in knowledge.
     *
     * @param command - The command carrying the document id and corrected text.
     * @returns The updated document.
     */
    execute(command: UpdateExtractedTextCommand): Promise<IDocument>;
}
