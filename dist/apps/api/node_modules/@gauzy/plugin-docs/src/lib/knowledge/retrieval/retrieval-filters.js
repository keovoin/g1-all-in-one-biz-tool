"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRetrievable = exports.isBlockedByReviewCircuitBreaker = void 0;
exports.applyRetrievalFilters = applyRetrievalFilters;
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const document_entity_1 = require("../../entities/document.entity");
const document_access_sql_1 = require("../../services/document-access.sql");
/**
 * The mandatory retrieval filter set (§9.2 of the AI-knowledge spec), applied identically
 * to BOTH legs (lexical and vector) in SQL — never relying on ORM defaults alone.
 * The pure predicate mirror lives in `retrieval-gate.ts` (re-exported here).
 */
var retrieval_gate_1 = require("./retrieval-gate");
Object.defineProperty(exports, "isBlockedByReviewCircuitBreaker", { enumerable: true, get: function () { return retrieval_gate_1.isBlockedByReviewCircuitBreaker; } });
Object.defineProperty(exports, "isRetrievable", { enumerable: true, get: function () { return retrieval_gate_1.isRetrievable; } });
/**
 * Applies the mandatory + optional filters to a `document_chunk` query builder (alias
 * `chunk`) joined to `document` (alias `doc`). Both retrieval legs share this builder so
 * the filter sets can never drift apart.
 *
 * @param qb A query builder rooted at `DocumentChunk` with alias `chunk`.
 * @param query The store query (tenant/org scope + optional facet filters).
 * @returns The same query builder, filtered.
 */
function applyRetrievalFilters(qb, query) {
    const filters = query.filters ?? {};
    qb.innerJoin(document_entity_1.Document, 'doc', (0, core_1.prepareSQLQuery)(`"doc"."id" = "chunk"."documentId"`));
    // Tenant + organization — on BOTH tables, in SQL (§18.3).
    qb.andWhere((0, core_1.prepareSQLQuery)(`"chunk"."tenantId" = :tenantId`), { tenantId: query.tenantId });
    qb.andWhere((0, core_1.prepareSQLQuery)(`"chunk"."organizationId" = :organizationId`), { organizationId: query.organizationId });
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."tenantId" = :tenantId`), { tenantId: query.tenantId });
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."organizationId" = :organizationId`), { organizationId: query.organizationId });
    // Indexed only (EXCLUDED rows can never match — belt-and-suspenders check stays).
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."knowledgeStatus" = :indexedStatus`), {
        indexedStatus: contracts_1.DocumentKnowledgeStatusEnum.INDEXED
    });
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."knowledgeStatus" != :excludedStatus`), {
        excludedStatus: contracts_1.DocumentKnowledgeStatusEnum.EXCLUDED
    });
    // Not archived / not deleted.
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."isArchived" = :notArchived`), { notArchived: false });
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."deletedAt" IS NULL`));
    // Review circuit breaker (§12): PENDING ai-generated/low-confidence and REJECTED are
    // out; manual and extraction-failed never block retrieval.
    qb.andWhere((0, core_1.prepareSQLQuery)(`NOT ("doc"."reviewStatus" = :pendingReview AND "doc"."reviewReason" IN (:...blockedReasons))`), {
        pendingReview: contracts_1.DocumentReviewStatusEnum.PENDING,
        blockedReasons: [contracts_1.DocumentReviewReasonEnum.AI_GENERATED, contracts_1.DocumentReviewReasonEnum.LOW_CONFIDENCE]
    });
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."reviewStatus" != :rejectedReview`), {
        rejectedReview: contracts_1.DocumentReviewStatusEnum.REJECTED
    });
    // Content searchable.
    qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."searchable" = :searchableFlag`), { searchableFlag: true });
    // Visibility + share composition (08 §3.4): ORGANIZATION docs, own docs, share grantees,
    // or DOCS_MANAGE sees all. The share leg is evaluated in the SAME SQL predicate as
    // visibility so retrieval can never diverge from the list/tree paths.
    if (!filters.hasManagePermission) {
        const legs = [(0, core_1.prepareSQLQuery)(`"doc"."visibility" = :orgVisibility`)];
        const parameters = { orgVisibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION };
        if (filters.userId) {
            legs.push((0, core_1.prepareSQLQuery)(`"doc"."createdByUserId" = :visibilityUserId`));
            parameters['visibilityUserId'] = filters.userId;
        }
        if (filters.employeeId) {
            legs.push((0, document_access_sql_1.buildShareGrantExistsSql)('doc'));
            parameters['shareEmployeeId'] = filters.employeeId;
            parameters['shareTenantId'] = query.tenantId;
        }
        qb.andWhere(`(${legs.join(' OR ')})`, parameters);
    }
    // Optional facets.
    if (filters.documentIds?.length) {
        qb.andWhere((0, core_1.prepareSQLQuery)(`"chunk"."documentId" IN (:...filterDocumentIds)`), { filterDocumentIds: filters.documentIds });
    }
    if (filters.kinds?.length) {
        qb.andWhere((0, core_1.prepareSQLQuery)(`"doc"."kind" IN (:...filterKinds)`), { filterKinds: filters.kinds });
    }
    if (filters.categoryIds?.length) {
        qb.andWhere((0, core_1.prepareSQLQuery)(`EXISTS (SELECT 1 FROM "document_category_document" "dcd" ` +
            `WHERE "dcd"."documentId" = "doc"."id" AND "dcd"."documentCategoryId" IN (:...filterCategoryIds))`), { filterCategoryIds: filters.categoryIds });
    }
    if (filters.tagIds?.length) {
        qb.andWhere((0, core_1.prepareSQLQuery)(`EXISTS (SELECT 1 FROM "tag_document" "td" ` +
            `WHERE "td"."documentId" = "doc"."id" AND "td"."tagId" IN (:...filterTagIds))`), { filterTagIds: filters.tagIds });
    }
    if (filters.entity && filters.entityId) {
        qb.andWhere((0, core_1.prepareSQLQuery)(`EXISTS (SELECT 1 FROM "document_link" "dl" ` +
            `WHERE "dl"."documentId" = "doc"."id" AND "dl"."entity" = :linkEntity AND "dl"."entityId" = :linkEntityId ` +
            `AND "dl"."tenantId" = :tenantId AND "dl"."organizationId" = :organizationId)`), { linkEntity: filters.entity, linkEntityId: filters.entityId });
    }
    return qb;
}
//# sourceMappingURL=retrieval-filters.js.map