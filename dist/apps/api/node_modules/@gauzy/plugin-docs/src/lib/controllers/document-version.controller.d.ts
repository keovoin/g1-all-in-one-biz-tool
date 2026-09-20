import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ID, IDocument, IDocumentVersion, IPagination } from '@gauzy/contracts';
import { GetDocumentVersionsQueryDTO } from '../dto/get-document-versions-query.dto';
export declare class DocumentVersionController {
    private readonly commandBus;
    private readonly queryBus;
    constructor(commandBus: CommandBus, queryBus: QueryBus);
    /**
     * Paginated version history, newest first — the list projection never returns content columns.
     */
    findAll(id: ID, params: GetDocumentVersionsQueryDTO): Promise<IPagination<IDocumentVersion>>;
    /**
     * One full snapshot incl. `contentJson`/`contentHtml`.
     */
    findById(id: ID, versionId: ID): Promise<IDocumentVersion>;
    /**
     * **Non-destructive** restore: first snapshots the current content as a new version, then
     * copies the target snapshot onto the document. Locked page → 423 `DOCS_LOCKED`.
     */
    restore(id: ID, versionId: ID): Promise<IDocument>;
}
