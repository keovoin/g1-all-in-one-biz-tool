import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentProcessingService } from '../../services/document-processing.service';
import { ReprocessDocumentCommand } from '../reprocess-document.command';
export declare class ReprocessDocumentHandler implements ICommandHandler<ReprocessDocumentCommand> {
    private readonly documentProcessingService;
    constructor(documentProcessingService: DocumentProcessingService);
    /**
     * Handles the `ReprocessDocumentCommand`: re-runs the pipeline from `docs.extract`
     * for a FILE document (409 when a human-edited extraction would be overwritten).
     *
     * @param command - The command carrying the document id and reprocess options.
     * @returns The document after the enqueue.
     */
    execute(command: ReprocessDocumentCommand): Promise<IDocument>;
}
