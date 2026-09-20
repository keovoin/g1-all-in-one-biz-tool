"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareTargetsSubject = shareTargetsSubject;
exports.effectiveShareAccess = effectiveShareAccess;
exports.hasShareAtLeast = hasShareAtLeast;
exports.isDocumentReadable = isDocumentReadable;
exports.isDocumentWritable = isDocumentWritable;
exports.isDocumentLockedFor = isDocumentLockedFor;
exports.canAdministerShares = canAdministerShares;
const contracts_1 = require("@gauzy/contracts");
/** Rank of the share access levels — `EDIT` implies `COMMENT` implies `VIEW`. */
const SHARE_ACCESS_RANK = {
    [contracts_1.DocumentShareAccessEnum.VIEW]: 1,
    [contracts_1.DocumentShareAccessEnum.COMMENT]: 2,
    [contracts_1.DocumentShareAccessEnum.EDIT]: 3
};
/**
 * Whether one share row targets the given subject (employee grant, or a team the subject
 * is currently a member of).
 *
 * @param share The share row.
 * @param subject The requesting subject.
 * @returns True when the row grants to this subject.
 */
function shareTargetsSubject(share, subject) {
    if (share.employeeId && subject.employeeId && share.employeeId === subject.employeeId) {
        return true;
    }
    if (share.teamId && subject.teamIds?.length) {
        return subject.teamIds.includes(share.teamId);
    }
    return false;
}
/**
 * The strongest share access the subject holds on the document, or `null` when no share
 * applies. Shares are an additive overlay on PRIVATE documents only — on ORGANIZATION
 * documents they have no effect in v1 (§3.3), so `null` is returned there as well.
 *
 * @param document The document projection (with its share rows).
 * @param subject The requesting subject.
 * @returns The highest applicable share access, or `null`.
 */
function effectiveShareAccess(document, subject) {
    if (document.visibility !== contracts_1.DocumentVisibilityEnum.PRIVATE) {
        return null;
    }
    let best = null;
    for (const share of document.shares ?? []) {
        if (!shareTargetsSubject(share, subject)) {
            continue;
        }
        if (!best || SHARE_ACCESS_RANK[share.access] > SHARE_ACCESS_RANK[best]) {
            best = share.access;
        }
    }
    return best;
}
/**
 * Whether the subject holds at least `minimum` through the share overlay.
 *
 * @param document The document projection.
 * @param subject The requesting subject.
 * @param minimum The minimum access required.
 * @returns True when a share of at least that level applies.
 */
function hasShareAtLeast(document, subject, minimum) {
    const access = effectiveShareAccess(document, subject);
    return !!access && SHARE_ACCESS_RANK[access] >= SHARE_ACCESS_RANK[minimum];
}
/**
 * The §3.4 effective-read-access truth table:
 *
 * | # | `DOCS_READ` | Visibility   | Creator | `DOCS_MANAGE` | Share >= VIEW | Readable |
 * |---|-------------|--------------|---------|---------------|---------------|----------|
 * | 1 | no          | any          | any     | any           | any           | **No**   |
 * | 2 | yes         | ORGANIZATION | any     | any           | any           | **Yes**  |
 * | 3 | yes         | PRIVATE      | yes     | any           | any           | **Yes**  |
 * | 4 | yes         | PRIVATE      | no      | yes           | any           | **Yes**  |
 * | 5 | yes         | PRIVATE      | no      | no            | yes           | **Yes**  |
 * | 6 | yes         | PRIVATE      | no      | no            | no            | **No**   |
 *
 * Row 6 is a 404 on the wire — existence is never revealed.
 *
 * @param document The document projection.
 * @param subject The requesting subject.
 * @returns True when the row is readable by the subject.
 */
function isDocumentReadable(document, subject) {
    // Row 1 — the permission gate is absolute; a share never substitutes for it.
    if (!subject.hasReadPermission) {
        return false;
    }
    // Row 2 — ORGANIZATION documents are readable org-wide.
    if (document.visibility !== contracts_1.DocumentVisibilityEnum.PRIVATE) {
        return true;
    }
    // Row 3 — the creator always reads their own PRIVATE documents.
    if (subject.userId && document.createdByUserId && document.createdByUserId === subject.userId) {
        return true;
    }
    // Row 4 — admin override.
    if (subject.hasManagePermission) {
        return true;
    }
    // Row 5 — the share overlay (any level implies VIEW).
    return hasShareAtLeast(document, subject, contracts_1.DocumentShareAccessEnum.VIEW);
}
/**
 * Write access per §3.4: readable AND the verb permission held AND
 * (owner OR `DOCS_MANAGE` OR an `EDIT` share). The lock check is deliberately NOT folded
 * in here — a locked-but-writable row is a 423, not a 403, and the callers distinguish the
 * two (`isDocumentLockedFor` below).
 *
 * @param document The document projection.
 * @param subject The requesting subject.
 * @returns True when the subject may mutate content/metadata of the row.
 */
function isDocumentWritable(document, subject) {
    if (!isDocumentReadable(document, subject)) {
        return false;
    }
    if (!subject.hasUpdatePermission) {
        return false;
    }
    if (subject.hasManagePermission) {
        return true;
    }
    if (subject.userId && document.createdByUserId && document.createdByUserId === subject.userId) {
        return true;
    }
    return hasShareAtLeast(document, subject, contracts_1.DocumentShareAccessEnum.EDIT);
}
/**
 * Whether the document's lock blocks this subject. The lock is bypassed by the owner and
 * by `DOCS_MANAGE` holders (§3.4).
 *
 * @param document The document projection.
 * @param subject The requesting subject.
 * @returns True when the subject is blocked by the lock (423 `DOCS_LOCKED`).
 */
function isDocumentLockedFor(document, subject) {
    if (!document.isLocked) {
        return false;
    }
    if (subject.hasManagePermission) {
        return false;
    }
    return !(subject.userId && document.createdByUserId && document.createdByUserId === subject.userId);
}
/**
 * Whether the subject may administer the share overlay of a document: the creator or a
 * `DOCS_MANAGE` holder only (§3.3 / §1.5). A share grantee — even at `EDIT` — can never
 * re-share.
 *
 * @param document The document projection.
 * @param subject The requesting subject.
 * @returns True when the subject may list/create/update/delete shares.
 */
function canAdministerShares(document, subject) {
    if (subject.hasManagePermission) {
        return true;
    }
    return !!(subject.userId && document.createdByUserId && document.createdByUserId === subject.userId);
}
//# sourceMappingURL=document-access.predicate.js.map