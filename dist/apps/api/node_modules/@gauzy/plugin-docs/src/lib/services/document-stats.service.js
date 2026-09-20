"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStatsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const type_orm_document_repository_1 = require("../repositories/type-orm-document.repository");
const document_quota_service_1 = require("./document-quota.service");
const document_service_1 = require("./document.service");
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
let DocumentStatsService = class DocumentStatsService {
    constructor(typeOrmDocumentRepository, documentService, documentQuotaService) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.documentService = documentService;
        this.documentQuotaService = documentQuotaService;
    }
    /**
     * Computes the stats envelope for one organization.
     *
     * @param params The validated query DTO — only the `where` organization scope is read.
     * @returns Totals by status, the needs-review count and the storage quota state.
     */
    async getDocumentStats(params) {
        // Same fallback chain as the list path: `whitelist: true` strips a top-level
        // organizationId, so the scope lives in `where` (or the request context).
        const organizationId = this.documentService.resolveOrganizationId(params);
        const [statusRows, needsReview, storage] = await Promise.all([
            this.buildScopedQuery(organizationId)
                .select('document.status', 'value')
                .addSelect('COUNT(*)', 'count')
                .groupBy('document.status')
                .getRawMany(),
            this.buildScopedQuery(organizationId)
                .andWhere((0, core_1.prepareSQLQuery)(`"document"."reviewStatus" = :pendingReview`), {
                pendingReview: contracts_1.DocumentReviewStatusEnum.PENDING
            })
                .getCount(),
            this.documentQuotaService.getQuotaState(organizationId)
        ]);
        const byStatus = {};
        let total = 0;
        for (const row of statusRows) {
            if (row.value === null || row.value === undefined)
                continue;
            const count = Number(row.count) || 0;
            byStatus[row.value] = count;
            total += count;
        }
        return { total, byStatus, needsReview, storage };
    }
    /**
     * The tile scope: tenant + organization + visibility predicate, archived excluded.
     * Mirrors what `DocumentService.buildFilteredQuery` produces for an empty filter
     * set (that builder is private; the two public scope helpers keep this in sync).
     */
    buildScopedQuery(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const qb = this.typeOrmDocumentRepository.createQueryBuilder('document');
        qb.where((0, core_1.prepareSQLQuery)(`"document"."tenantId" = :tenantId`), { tenantId });
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."organizationId" = :organizationId`), { organizationId });
        this.documentService.applyVisibilityScope(qb);
        qb.andWhere((0, core_1.prepareSQLQuery)(`"document"."isArchived" = :isArchived`), { isArchived: false });
        return qb;
    }
};
exports.DocumentStatsService = DocumentStatsService;
exports.DocumentStatsService = DocumentStatsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        document_service_1.DocumentService,
        document_quota_service_1.DocumentQuotaService])
], DocumentStatsService);
//# sourceMappingURL=document-stats.service.js.map