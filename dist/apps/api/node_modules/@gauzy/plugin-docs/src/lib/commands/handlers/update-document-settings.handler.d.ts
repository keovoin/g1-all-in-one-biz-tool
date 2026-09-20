import { ICommandHandler } from '@nestjs/cqrs';
import { IDocumentSettings } from '../../dto/document-settings.dto';
import { DocumentSettingsService } from '../../services/document-settings.service';
import { UpdateDocumentSettingsCommand } from '../update-document-settings.command';
export declare class UpdateDocumentSettingsHandler implements ICommandHandler<UpdateDocumentSettingsCommand> {
    private readonly documentSettingsService;
    constructor(documentSettingsService: DocumentSettingsService);
    /**
     * Handles the `UpdateDocumentSettingsCommand`: partial update of the org-defaults block.
     *
     * @param command - The command carrying the organization id and defaults payload.
     * @returns The updated settings envelope.
     */
    execute(command: UpdateDocumentSettingsCommand): Promise<IDocumentSettings>;
}
