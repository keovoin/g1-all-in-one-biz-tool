import { IQueryHandler } from '@nestjs/cqrs';
import { DocumentStatsService, IDocumentStats } from '../../services/document-stats.service';
import { GetDocumentStatsQuery } from '../get-document-stats.query';
export declare class GetDocumentStatsHandler implements IQueryHandler<GetDocumentStatsQuery> {
    private readonly documentStatsService;
    constructor(documentStatsService: DocumentStatsService);
    /**
     * Handles the `GetDocumentStatsQuery`: org-global counts for the stats tiles
     * (status totals, needs-review, storage quota state).
     *
     * @param query - The query carrying the organization scope.
     * @returns The stats envelope.
     */
    execute(query: GetDocumentStatsQuery): Promise<IDocumentStats>;
}
