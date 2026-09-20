"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlockedByReviewCircuitBreaker = isBlockedByReviewCircuitBreaker;
exports.isRetrievable = isRetrievable;
const contracts_1 = require("@gauzy/contracts");
/**
 * The review circuit breaker (§12): a `PENDING` document with reason `ai-generated` or
 * `low-confidence`, or any `REJECTED` document, is blocked from retrieval (and from
 * `docs_read`). Reasons `manual` and `extraction-failed` never block.
 */
function isBlockedByReviewCircuitBreaker(document) {
    if (document.reviewStatus === contracts_1.DocumentReviewStatusEnum.REJECTED) {
        return true;
    }
    return (document.reviewStatus === contracts_1.DocumentReviewStatusEnum.PENDING &&
        (document.reviewReason === contracts_1.DocumentReviewReasonEnum.AI_GENERATED ||
            document.reviewReason === contracts_1.DocumentReviewReasonEnum.LOW_CONFIDENCE));
}
/**
 * The full retrievability predicate mirrored by the SQL filter set — INDEXED, not
 * archived/deleted, searchable, and not blocked by the review circuit breaker.
 */
function isRetrievable(document) {
    return (document.knowledgeStatus === contracts_1.DocumentKnowledgeStatusEnum.INDEXED &&
        document.isArchived !== true &&
        !document.deletedAt &&
        document.searchable !== false &&
        !isBlockedByReviewCircuitBreaker(document));
}
//# sourceMappingURL=retrieval-gate.js.map