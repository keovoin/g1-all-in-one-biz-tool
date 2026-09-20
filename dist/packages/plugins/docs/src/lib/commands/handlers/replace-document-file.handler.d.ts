import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentUploadService } from '../../services/document-upload.service';
import { ReplaceDocumentFileCommand } from '../replace-document-file.command';
export declare class ReplaceDocumentFileHandler implements ICommandHandler<ReplaceDocumentFileCommand> {
    private readonly documentUploadService;
    constructor(documentUploadService: DocumentUploadService);
    /**
     * Handles the `ReplaceDocumentFileCommand`: swaps the stored blob of an existing FILE
     * document in place, bumps `version` and re-runs the pipeline (R-UPL-05).
     *
     * @param command - The command carrying the document id, form fields and the new file.
     * @returns The document after the swap.
     */
    execute(command: ReplaceDocumentFileCommand): Promise<IDocument>;
}
