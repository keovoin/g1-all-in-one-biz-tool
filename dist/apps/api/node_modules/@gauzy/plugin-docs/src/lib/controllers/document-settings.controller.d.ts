import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DocumentSettingsDTO, DocumentSettingsQueryDTO, IDocumentSettings } from '../dto/document-settings.dto';
export declare class DocumentSettingsController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Org defaults + read-only deployment capabilities.
     */
    getSettings(query: DocumentSettingsQueryDTO): Promise<IDocumentSettings>;
    /**
     * Partial update of the org-defaults block only (`capabilities` is never writable).
     */
    updateSettings(input: DocumentSettingsDTO, query?: DocumentSettingsQueryDTO): Promise<IDocumentSettings>;
}
