import { ICommandHandler } from '@nestjs/cqrs';
import { IDocument } from '@gauzy/contracts';
import { DocumentService } from '../../services/document.service';
import { DocumentVersionService } from '../../services/document-version.service';
import { RestoreDocumentVersionCommand } from '../restore-document-version.command';
export declare class RestoreDocumentVersionHandler implements ICommandHandler<RestoreDocumentVersionCommand> {
    private readonly documentService;
    private readonly documentVersionService;
    constructor(documentService: DocumentService, documentVersionService: DocumentVersionService);
    /**
     * Handles the `RestoreDocumentVersionCommand`: **non-destructive** restore — first snapshots
     * the current content as a new version, then copies the target snapshot onto the document.
     *
     * @param command - The command carrying the document and version ids.
     * @returns The updated document.
     */
    execute(command: RestoreDocumentVersionCommand): Promise<IDocument>;
}
