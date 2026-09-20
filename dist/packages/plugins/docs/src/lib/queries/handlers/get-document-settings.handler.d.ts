import { IQueryHandler } from '@nestjs/cqrs';
import { IDocumentSettings } from '../../dto/document-settings.dto';
import { DocumentSettingsService } from '../../services/document-settings.service';
import { GetDocumentSettingsQuery } from '../get-document-settings.query';
export declare class GetDocumentSettingsHandler implements IQueryHandler<GetDocumentSettingsQuery> {
    private readonly documentSettingsService;
    constructor(documentSettingsService: DocumentSettingsService);
    /**
     * Handles the `GetDocumentSettingsQuery`: org defaults + read-only deployment capabilities.
     *
     * @param query - The query carrying the organization id.
     * @returns The settings envelope.
     */
    execute(query: GetDocumentSettingsQuery): Promise<IDocumentSettings>;
}
