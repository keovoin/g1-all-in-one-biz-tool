"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyRecoveryAction = classifyRecoveryAction;
const contracts_1 = require("@gauzy/contracts");
/**
 * The pure recovery predicate — given one document row and the current time, decides
 * what the sweep should do. Deterministic and side-effect free (unit-tested directly).
 *
 * Rules (§7.5 of the backend spec):
 * 1. FILE in `UPLOADED` older than the stale window with no live job → re-enqueue extract
 *    (covers enqueue-lost races when Redis was briefly unavailable at upload time).
 * 2. `PROCESSING` whose `updatedAt` is older than the stuck threshold → re-enqueue
 *    extract (mid-run crash); stuck beyond the fail-after window → flip to `FAILED`.
 * 3. Knowledge `QUEUED`/`INDEXING` stale by the same rule (content pipeline already done)
 *    → re-enqueue from chunk.
 *
 * @param row The (partial) document row.
 * @param now The evaluation instant.
 * @param thresholds The staleness thresholds.
 * @returns The action to take, or null to leave the row alone.
 */
function classifyRecoveryAction(row, now, thresholds) {
    // No timestamp → cannot judge staleness; leave the row alone.
    if (!row.updatedAt) {
        return null;
    }
    const updatedAt = new Date(row.updatedAt).getTime();
    const ageMinutes = (now.getTime() - updatedAt) / 60_000;
    if (row.status === contracts_1.DocumentStatusEnum.PROCESSING) {
        if (ageMinutes >= thresholds.failAfterHours * 60) {
            return 'mark-failed';
        }
        if (ageMinutes >= thresholds.stuckThresholdMinutes) {
            return 'reenqueue-extract';
        }
        return null;
    }
    if (row.kind === contracts_1.DocumentKindEnum.FILE && row.status === contracts_1.DocumentStatusEnum.UPLOADED) {
        return ageMinutes >= thresholds.uploadedStaleMinutes ? 'reenqueue-extract' : null;
    }
    if (row.status === contracts_1.DocumentStatusEnum.READY &&
        (row.knowledgeStatus === contracts_1.DocumentKnowledgeStatusEnum.QUEUED ||
            row.knowledgeStatus === contracts_1.DocumentKnowledgeStatusEnum.INDEXING)) {
        return ageMinutes >= thresholds.stuckThresholdMinutes ? 'reenqueue-chunk' : null;
    }
    return null;
}
//# sourceMappingURL=docs-recovery.predicate.js.map