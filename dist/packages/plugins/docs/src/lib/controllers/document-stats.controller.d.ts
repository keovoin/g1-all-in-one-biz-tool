import { QueryBus } from '@nestjs/cqrs';
import { GetDocumentsQueryDTO } from '../dto';
import { IDocumentStats } from '../services/document-stats.service';
/**
 * `GET /plugins/docs/documents/stats` — org-global counts for the browse page's
 * stats tiles.
 *
 * 🛑 A separate controller on purpose: the static `/stats` segment must be
 * registered BEFORE `DocumentController`'s `/:id` routes or Nest resolves it into
 * `GET /documents/:id` (a UUID-pipe 400). Nest keeps declaration order across
 * controllers, so this controller precedes `DocumentController` in the barrel's
 * `Controllers` array — moving it after is a silent route shadowing.
 */
export declare class DocumentStatsController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    /**
     * Org-global document counts (status totals, needs-review, storage quota state).
     * Filters beyond the mandatory `where` organization scope are ignored — tile
     * numbers are stable while the user filters (the facets endpoint is the
     * filter-relative one).
     */
    getStats(params: GetDocumentsQueryDTO): Promise<IDocumentStats>;
}
