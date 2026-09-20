import { DocumentStatusEnum } from '@gauzy/contracts';
import { GetDocumentsQueryDTO } from '../dto';
import { TypeOrmDocumentRepository } from '../repositories/type-orm-document.repository';
import { DocumentQuotaService } from './document-quota.service';
import { DocumentService } from './document.service';
import { IDocumentQuotaState } from './quota.calculator';
/** Response of `GET /plugins/docs/documents/stats` — the browse page's stats tiles. */
export interface IDocumentStats {
    /** Non-archived documents in the organization scope. */
    total: number;
    /** Counts per RAW status — the UI folds UPLOADED into PROCESSING, same as the facets. */
    byStatus: Partial<Record<DocumentStatusEnum, number>>;
    /** `reviewStatus = PENDING` count — the same predicate as the needs-review preset. */
    needsReview: number;
    /** Same shape as the settings quota block; `quotaBytes: 0` = unlimited. */
    storage: IDocumentQuotaState;
}
/**
 * Org-global counts for the Documents-hub stats tiles.
 *
 * Deliberately NOT the facets endpoint: `getDocumentFacets` costs ~11 GROUP BY /
 * count queries per call and its numbers are filter-relative (each facet computed
 * over the OTHER filters), so tile numbers would shift as filters change. This is
 * three cheap queries whose numbers only move when documents do.
 *
 * Scope semantics: tenant + organization + the caller's visibility predicate,
 * archived rows excluded — i.e. exactly what the "All" preset counts. Filters on
 * the DTO beyond the mandatory `where` scope are intentionally ignored.
 */
export declare class DocumentStatsService {
    private readonly typeOrmDocumentRepository;
    private readonly documentService;
    private readonly documentQuotaService;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, documentService: DocumentService, documentQuotaService: DocumentQuotaService);
    /**
     * Computes the stats envelope for one organization.
     *
     * @param params The validated query DTO — only the `where` organization scope is read.
     * @returns Totals by status, the needs-review count and the storage quota state.
     */
    getDocumentStats(params: GetDocumentsQueryDTO): Promise<IDocumentStats>;
    /**
     * The tile scope: tenant + organization + visibility predicate, archived excluded.
     * Mirrors what `DocumentService.buildFilteredQuery` produces for an empty filter
     * set (that builder is private; the two public scope helpers keep this in sync).
     */
    private buildScopedQuery;
}
